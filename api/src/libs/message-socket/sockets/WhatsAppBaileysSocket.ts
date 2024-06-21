import makeWASocket, { DisconnectReason, MessageUpsertType, AnyMediaMessageContent, downloadMediaMessage, proto, useMultiFileAuthState } from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import pino from "pino"
import fs from "fs"
import { ContactType, ConversationType, Base64Buffer } from "../../../types"
import { ContactModel, ConversationModel, InboxModel } from "../../models"
import path from "path"
import { getClientList, getWss } from "../../../app"
import WS from "../../message-socket/websocket-adapter"
import { getMessageByWhatsAppId } from "../../../service/messageService"
import { Join } from "../../orm/query"
import { getOrCreateContactByPhoneNumber } from "../../../service/contactService"
import { getOrCreateConversation } from "../../../service/conversationService"
import { getInboxByName } from "../../../service/inboxService"
import { Socket } from "./socket"
import { MediaMessageType } from "../../../types"
import { BAILEYS_SESSION_FOLDER } from "../../../constants"
import { InboxType, MessageType } from "../../schemas"
import { SocketSessionError } from "./errors"

const sseClients = getClientList()

export class WhatsAppBaileysSocket extends Socket {
    sock: any
    store:any
    saveCreds:any

    constructor(folder: string) {
        super(folder)
        this.start()
        
    }
    async start() {

        const { state, saveCreds } = await useMultiFileAuthState(`socket_provider_session_files/sessions/${this.folder}`)
        const sock = makeWASocket({ auth: state, logger: pino({ level: "silent" }) })
        sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
            qr && this.saveQRCode(qr)
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error).output.statusCode
                const shouldReconnect = reason !== DisconnectReason.loggedOut
                const shouldLogout = reason !== DisconnectReason.connectionClosed

                if (shouldReconnect) {
                    await this.start()
                }
            } else if (connection === "open") {
                this.sentCreds()
            }
        })
        // const ppUrl = await sock.profilePictureUrl("xyz@g.us", 'image')
        sock.ev.on("creds.update", async () => await Promise.all([saveCreds(), this.sentCreds()]))
        sock.ev.on("messages.upsert", evt => this.messageUpsert(evt))
        this.sock = sock
        this.saveCreds = saveCreds

    }

    async verifyStatus(logout = false) {
        try {
            if (!this.sock.user) return false
            await this.sock.sendPresenceUpdate("available")
            return true
        } catch (e) {
            if (e instanceof Boom && e.output.statusCode == DisconnectReason.connectionClosed) {
                if (logout) {
                    await this.logout()
                }
                return false
            } else {
                console.log("Verify error")
                console.log({ e })
            }
        }
    }
    async logout() {
        try {

            await this.sock.logout()
        } catch (e){

        }
        const carpetaSesion = path.join(BAILEYS_SESSION_FOLDER, this.folder);

        // Verificar si la carpeta existe
        if (fs.existsSync(carpetaSesion)) {
            // Eliminar la carpeta
            console.log("logout " + carpetaSesion);
            this.sock = undefined
            fs.rmdir(carpetaSesion, { recursive: true }, (err) => {
                console.log("in logout " + carpetaSesion);
                if (err) {
                    console.error('Error al eliminar la carpeta:', err);
                } else {
                    console.log('Carpeta eliminada correctamente');

                    this.start().then(() => this.sentCreds()).then(() => this.sock?.ev?.flush())

                }
            });
        }
        await this.start()
    }
    async getBase64Buffer(m:proto.IWebMessageInfo):Promise<null | Base64Buffer> {
        if(!m.message){
            return null
        }
        const { message } = m
        const { imageMessage, audioMessage, videoMessage, documentMessage, documentWithCaptionMessage, } = message
        
        if(Object.values({ imageMessage, audioMessage, videoMessage, documentMessage, documentWithCaptionMessage }).filter(v => v !== null).length == 0) {
            return null
        }

        try {
            const ctx = { 
                logger: this.sock.logger, 
                reuploadRequest: this.sock.updateMediaMessage 
            }
            const buffer = await downloadMediaMessage(m, 'buffer', { }, ctx);
            const base64Buffer:Base64Buffer = {
                base64: buffer.toString('base64'),
                tipo: "text"
            }
            if(imageMessage) {
                base64Buffer.tipo = Socket.MEDIA_MESSAGE.imageMessage
                base64Buffer.caption = imageMessage.caption
            } else if (audioMessage) {
                base64Buffer.tipo = Socket.MEDIA_MESSAGE.audioMessage
                base64Buffer.caption = audioMessage.seconds?.toString()
            } else if  (videoMessage) {
                base64Buffer.tipo = Socket.MEDIA_MESSAGE.videoMessage
            } else if  (documentMessage) {
                base64Buffer.tipo = Socket.MEDIA_MESSAGE.documentMessage
                base64Buffer.caption = documentMessage.fileName
            } else if  (documentWithCaptionMessage) {
                if(!documentWithCaptionMessage?.message?.documentMessage){
                    return null
                }
                base64Buffer.tipo = Socket.MEDIA_MESSAGE.documentMessage
                base64Buffer.caption = documentWithCaptionMessage.message.documentMessage.fileName
            }
            return  base64Buffer
        } catch (error) {
            console.error('Error al descargar el medio:', error);
            return null
        }
    }
    async sendMessageorContact({ m }: { m: proto.IWebMessageInfo }): Promise<void> {
        const wss = getWss()
        if (!m.message) return
        if (m.key.remoteJid?.split('@')[1] === 'g.us') return
        const base64Buffer =  await this.getBase64Buffer(m)
        const phoneNumber = '+' + m.key.remoteJid?.split('@')[0]
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text

        const joinResult = (
            await ContactModel.query
                .join(ContactModel.r.conversations, Join.INNER)
                .join(InboxModel, ConversationModel.c.inboxId, InboxModel.c.id)
                .filter(ContactModel.c.phoneNumber.equalTo(phoneNumber), InboxModel.c.name.equalTo(this.folder))
                .fetchAllQuery<ContactType & { conversation: ConversationType, inbox: InboxType }>()
        )

        let result = joinResult[0];
        if(!result){
            if (phoneNumber == '+status') return
            if(m.key.fromMe ===true)return
            const inbox = await getInboxByName(this.folder)
            const base64ProfilePhoto = m.key.remoteJid ? await this.getBase64ProfilePhoto(m.key.remoteJid) : undefined
            const contact = await getOrCreateContactByPhoneNumber(phoneNumber, m.pushName!, base64ProfilePhoto)
            const conversation = await getOrCreateConversation(inbox.id, contact.id)
            result = {
                ...contact,
                inbox,
                conversation
            }
        }
        if (result && m.key.id) {
            const conversationID = result.conversation.id
            const fromMe = m.key.fromMe === true;
            const data = { ...result, text, fromMe, messageID: m.key.id, base64Buffer }
            let message
            if (fromMe) {
                const res = await getMessageByWhatsAppId(m.key.id)
                if (res.length == 0) {
                    message = await WS.outgoingMessageFromWS(data)
                }
            } else {
                message = await WS.incomingMessage(data)
            }
            if (message) {
                for (const ws of wss.clients) {
                    ws.emit('message-upsert' + conversationID, message);
                }
            }
        }
    }
    async getBase64ProfilePhoto(remoteJid:string){
        const ppUrl = await this.sock.profilePictureUrl(remoteJid, 'image')
        if(ppUrl){
            const buffer = await fetch(ppUrl).then(response => response.arrayBuffer())
            const base64 = Buffer.from( buffer ).toString( 'base64' )
            return base64
        }   
        return undefined
        
    }
    async messageUpsert({ messages, type }: { messages: proto.IWebMessageInfo[], type: MessageUpsertType }) {
        for (const m of messages){
            await this.sendMessageorContact({ m })
        }
    }

    sentCreds(): void {
        sseClients.emitToClients("qr-update", { name: this.folder, user: this.sock?.user ?? false, qr: this.getQRBase64() })
    }
    async sendMessage(phone: string, message: Omit<MessageType, "id">): Promise<Omit<MessageType, "id">> {
        if (await this.verifyStatus() === false) {
            console.error("No active session")
            throw new SocketSessionError(this)
        }
        const mensaje = {
            text: message.content
        }
        const wMessage = await this.sock.sendMessage(`${phone}@s.whatsapp.net`, mensaje)
        message.whatsappId = wMessage.key.id
        return message
    }
    
    async sendMediaMessage(phone: string, message: MessageType, media: MediaMessageType): Promise<Omit<MessageType, "id">> {
        if (await this.verifyStatus() === false) {
            console.error("No active session")
            throw new Error("No active session")
        }
        let sendedMedia:any = media
        if(media.audio){
            sendedMedia = {...sendedMedia, ppt:true, seconds:10}
        } 
        const wMessage = await this.sock.sendMessage(`${phone}@s.whatsapp.net`, sendedMedia)
        message.whatsappId = wMessage.key.id
        return message
    }
    

    get isQRBased(){
        return true
    }
    async user(){
        return this.sock.user
    }
    async getContactId(contact: ContactType) {
        return contact.phoneNumber.split('+')[1]
    }
}