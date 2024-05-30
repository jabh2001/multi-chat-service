import { Input, Telegraf } from "telegraf";
import { anyOf, message } from "telegraf/filters";
import { Base64Buffer, ConversationType, MediaMessageType, WSMessageUpsertType } from "../../../types";
import { ContactType, InboxType, MessageType } from "../../schemas";
import { Socket } from "./socket";
import fs from "fs"
import { getClientList, getWss } from "../../../app";
import { Document, PhotoSize, Video, Voice } from "telegraf/typings/core/types/typegram";
import { ContactModel, ConversationModel, InboxModel } from "../../models";
import { Join } from "../../orm/query";
import { getInboxByName } from "../../../service/inboxService";
import { getOrCreateContactByPhoneNumber } from "../../../service/contactService";
import { getOrCreateConversation } from "../../../service/conversationService";
import WS from "../websocket-adapter";
import { TELEGRAM_BOTS_TOKEN_FOLDER } from "../../../constants";

const sseClients = getClientList()
const wss = getWss()
export class TelegramTelegrafSocket extends Socket {

    _bot:Telegraf

    constructor(folder: string, private _telegramBotToken:string) {
        super(folder)
        this._bot = this.start()
    }
    get  telegramBotToken(): string {
        return this._telegramBotToken
    }
    get bot (){
        return this._bot
    }
    start() {
        const bot = new Telegraf(this._telegramBotToken);
        this.saveCreds()
        bot.on(message("text"), async ({ text, message:{ message_id }, from:{ id, first_name, last_name } }) => {
            const result = await this.verifyContact({ id, first_name, last_name })
            this.outgoingMessage({ text, messageID:message_id.toString(), result})
        })
        bot.on(message("voice"), async ({ message:{ voice, caption, message_id}, from:{ id, first_name, last_name } }) => {
            const base64Buffer = await this.getBase64Buffer({ caption, audio:voice})
            const result = await this.verifyContact({ id, first_name, last_name })
            this.outgoingMessage({ messageID:message_id.toString(), result, base64Buffer})
        })
        bot.on(message("photo"), async ({ message:{ photo, caption, message_id}, from:{ id, first_name, last_name } }) => {
            const base64Buffer = await this.getBase64Buffer({ caption, photo:photo[photo.length-1]})
            const result = await this.verifyContact({ id, first_name, last_name })
            this.outgoingMessage({ messageID:message_id.toString(), result, base64Buffer})
        })
        bot.on(message("video"), async ({ message:{ video, caption, message_id}, from:{ id, first_name, last_name } }) => {
            const base64Buffer = await this.getBase64Buffer({ caption, video})
            const result = await this.verifyContact({ id, first_name, last_name })
            this.outgoingMessage({ messageID:message_id.toString(), result, base64Buffer})
        })
        bot.on(message("document"), async ({ message:{ document, caption, message_id}, from:{ id, first_name, last_name } }) => {
            const base64Buffer = await this.getBase64Buffer({ caption, document})
            const result = await this.verifyContact({ id, first_name, last_name })
            this.outgoingMessage({ messageID:message_id.toString(), result, base64Buffer})
        })
        bot.launch()

        return bot
    }
    async verifyContact({ id, first_name, last_name }:{ id:number, first_name?:string, last_name?:string }){

        const joinResult = (
            await ContactModel.query
                .join(ContactModel.r.conversations, Join.INNER)
                .join(InboxModel, ConversationModel.c.inboxId, InboxModel.c.id)
                .filter(ContactModel.c.phoneNumber.equalTo(id), InboxModel.c.name.equalTo(this.folder))
                .fetchAllQuery<ContactType & { conversation: ConversationType, inbox: InboxType }>()
        )

        let result = joinResult[0];
        if(!result){
            const inbox = await getInboxByName(this.folder)
            const contact = await getOrCreateContactByPhoneNumber(id.toString(), `${first_name} ${last_name}`)
            const conversation = await getOrCreateConversation(inbox.id, contact.id)
            result = {
                ...contact,
                inbox,
                conversation
            }
        }
        return result
    }
    async outgoingMessage({ text, messageID, result:{ conversation}, base64Buffer}:OutgoingMessageParams){
        const conversationID = conversation.id
        let message = await WS.incomingMessage({ base64Buffer:base64Buffer ?? null, conversation, text, messageID} as any)
        if (message) {
            for (const ws of wss.clients) {
                ws.emit('message-upsert' + conversationID, message);
            }
        }
    }
    saveCreds(){
        TelegramTelegrafSocket.saveToken(this.folder, this.telegramBotToken)
    }
    sentCreds(){
        this.bot.telegram.getMe().then(user => sseClients.emitToClients("qr-update", { name: this.folder, user: user  ?? false, qr: this.getQRBase64() }))
    }
    async downloadFileConvertBase64(file_id:string) {
        const file = await this.bot.telegram.getFileLink( file_id )
        const response = await fetch(file)
        const buffer = await response.arrayBuffer()
        const base64 = Buffer.from( buffer ).toString( 'base64' )
        return base64
    }
    async getBase64Buffer({ photo, audio, video, document, caption}:TransformBase64Params):Promise<null | Base64Buffer> {
        if(Object.values({ photo, audio, video, document }).filter(v => v !== null).length == 0) {
            return null
        }
        try {
            if(photo) {
                return {
                    tipo: Socket.MEDIA_MESSAGE.imageMessage,
                    caption,
                    base64: await this.downloadFileConvertBase64(photo.file_id)
                }
            } else if (audio) {
                return {
                    tipo: Socket.MEDIA_MESSAGE.audioMessage,
                    caption: caption ?? audio.duration?.toString(),
                    base64: await this.downloadFileConvertBase64(audio.file_id)
                }
            } else if  (video) {
                return {
                    tipo: Socket.MEDIA_MESSAGE.videoMessage,
                    caption,
                    base64: await this.downloadFileConvertBase64(video.file_id)
                }
            }else if  (document) {
                return {
                    tipo: Socket.MEDIA_MESSAGE.documentMessage,
                    caption:caption ?? document.file_name,
                    base64: await this.downloadFileConvertBase64(document.file_id)
                }
            }
            return null
        } catch (error) {
            console.error('Error al descargar el medio:', error);
            return null
        }
    }

    async sendMessage(id: string, message: Omit<MessageType, "id">){
        const { message_id } = await this.bot.telegram.sendMessage(id, message.content ?? "")
        message.whatsappId = message_id.toString()
        return message
    }
    async sendMediaMessage( id: string, message: Omit<MessageType, "id">, { image, audio, video, document, caption }: MediaMessageType){
        if(image){
            const { message_id } = await this.bot.telegram.sendPhoto(id, Input.fromBuffer(image), { caption })
            message.whatsappId = message_id.toString()
        } else if(audio){
            const { message_id } = await this.bot.telegram.sendVoice(id, Input.fromBuffer(audio), { caption })
            message.whatsappId = message_id.toString()
        } else if(video){
            const { message_id } = await this.bot.telegram.sendVideo(id, Input.fromBuffer(video), { caption })
            message.whatsappId = message_id.toString()
        } else if(document){
            const { message_id } = await this.bot.telegram.sendDocument(id, Input.fromBuffer(document), { caption })
            message.whatsappId = message_id.toString()
        }
        return message
    }
    get isQRBased(){
        return false
    }
    async user(){
        return await this.bot.telegram.getMe()
    }
    async getContactId(contact: ContactType) {
        return contact.phoneNumber
    }
    static fromFolder(folder:string){
        const token = TelegramTelegrafSocket.getToken(folder)
        if( !token ) return null
        return new TelegramTelegrafSocket(folder, token)
    }
    static saveToken(folder:string, token:string){
        if(!fs.existsSync(TELEGRAM_BOTS_TOKEN_FOLDER)){
            fs.mkdirSync(TELEGRAM_BOTS_TOKEN_FOLDER)
        }
        fs.writeFileSync(`${TELEGRAM_BOTS_TOKEN_FOLDER}/${folder}.json`, JSON.stringify({ token }, null, 4), "utf8")

    }
    static getToken( folder:string){
        if(!fs.existsSync(TELEGRAM_BOTS_TOKEN_FOLDER)){
            fs.mkdirSync(TELEGRAM_BOTS_TOKEN_FOLDER)
        }
        if(!fs.existsSync(`${TELEGRAM_BOTS_TOKEN_FOLDER}/${folder}.json`)){
            return undefined
        }
        const data = fs.readFileSync(`${TELEGRAM_BOTS_TOKEN_FOLDER}/${folder}.json`, "utf8")
        const { token } = JSON.parse(data); //now it an object
        return token as string
    }
}

type TransformBase64Params = {
    photo?:PhotoSize
    audio?:Voice
    video?:Video
    document?:Document
    caption?:string

}
type OutgoingMessageParams = {
    text?:string
    messageID:string
    result:ContactType & { conversation:ConversationType, inbox:InboxType }
    base64Buffer?:Base64Buffer | null
}