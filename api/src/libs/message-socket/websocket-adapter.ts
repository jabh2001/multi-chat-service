import { AgentType, WSMessageUpsertType } from '../../types'
import { ContactType, FastMediaMessageType, MessageType } from '../schemas'
import { saveNewMessageInConversation } from '../../service/messageService'
import { Socket } from './sockets/socket'
import { getFastMessageById } from '../../service/fastMessageService'
export default class WS {

    static async incomingMessage(data: WSMessageUpsertType) {
        let buffer: undefined | string = undefined
        let bufferType: undefined | string = undefined
        if (data.base64Buffer) {
            buffer = data.base64Buffer.base64 === null ? undefined : data.base64Buffer.base64
            bufferType = data.base64Buffer.tipo === null ? undefined : data.base64Buffer.tipo
        }
        let message: Omit<MessageType, "id"> = {
            whatsappId: data.messageID,
            content: String(data.text),
            contentType: data.base64Buffer === null ? 'text' : bufferType!,
            conversationId: data.conversation.id,
            messageType: data.fromMe === true ? 'outgoing' : 'incoming',
            private: true,
            buffer: buffer,
        }
        const result = await saveNewMessageInConversation(data.conversation.id, message)
        return JSON.stringify(result)
    }
    static async outgoingMessageFromWS(data: WSMessageUpsertType) {
        let buffer: undefined | string = undefined
        let bufferType: undefined | string = undefined
        let captionText: undefined | null | string = undefined
        if (data.base64Buffer) {
            buffer = data.base64Buffer.base64 === null ? undefined : data.base64Buffer.base64
            bufferType = data.base64Buffer.tipo === null ? undefined : data.base64Buffer.tipo
            captionText = data.base64Buffer.caption
        }
        const conversationId = data.conversation.id
        let message: Omit<MessageType, "id"> = {
            conversationId,
            contentType: data.base64Buffer === null ? 'text' : bufferType!,
            content: captionText ?? String(data.text),
            private: false,
            messageType: "outgoing",
            whatsappId: data.messageID,
            buffer: buffer,
        }
        const result = await saveNewMessageInConversation(conversationId, message)
        return JSON.stringify(result)

    }
    static async outgoingMessage(data: any, socket: Socket) {
        const contact: ContactType = data.contact
        const user: AgentType = data.user
        const conversationId = data.conversationId
        let message: Omit<MessageType, "id"> = {
            senderId: data.sender,
            whatsappId: '',
            conversationId: conversationId,
            contentType: 'text',
            content: data.message,
            private: true,
            messageType: "outgoing",
            buffer: data.base64Buffer,
        }
        if(data.listBufferBase64 || data.fastMessage){
            let list: MediaMessageListType
            const returnedList: any[] = []
            if (data.listBufferBase64 !== undefined && Array.isArray(data.listBufferBase64)) {
                list = data.listBufferBase64
            } else if (data.fastMessage) {
                const fastMedia = await getFastMessageById(data.fastMessage)
                list = fastMedia.fastMediaMessages!
            }
            if(list === undefined) {
                return returnedList
            }
            for (const m of list) {
                const { base64, text, messageType} = m
                const bufferSinComa = base64?.split(',')[1]
                const buffer = base64 ? Buffer.from(bufferSinComa!, 'base64') : undefined;
                message.buffer = base64?.split(",")[1]
                if(!base64){
                    message.contentType = Socket.MEDIA_MESSAGE.text
                    message.content = text
                    message = await socket.sendMessage(contact.phoneNumber.split('+')[1], message)
                } else if (isVideo(messageType)) {
                    message.contentType = Socket.MEDIA_MESSAGE.videoMessage
                    message = await socket.sendMediaMessage(contact.phoneNumber.split('+')[1], message, { video:buffer!, caption: text || ''})
                }  else if (isImage(messageType)) {
                    message.contentType = Socket.MEDIA_MESSAGE.imageMessage
                    message.content = text
                    message = await socket.sendMediaMessage(contact.phoneNumber.split('+')[1], message, { image:buffer!, caption: text || ''})
                }  else if (isAudio(messageType)) {
                    message.contentType = Socket.MEDIA_MESSAGE.audioMessage
                    message = await socket.sendMediaMessage(contact.phoneNumber.split('+')[1], message, { audio:buffer!})
                }  else if (isDocument(messageType)) {
                    message.contentType = Socket.MEDIA_MESSAGE.documentMessage
                    message = await socket.sendMediaMessage(contact.phoneNumber.split('+')[1], message, { document:buffer!})
                }
                const result = await saveNewMessageInConversation(conversationId, message)
                returnedList.push({ ...result, user })
            }
            return returnedList
        } else {
            message = await socket.sendMessage(contact.phoneNumber.split('+')[1], message)
            const result = await saveNewMessageInConversation(conversationId, message)
            return { ...result, user }
        }

    }
}
const isImage = (type:string) => type.match(/image*/i) 
const isAudio = (type:string) => type.match(/audio*/i) 
const isVideo = (type:string) => type.match(/video*/i) 
const isDocument = (type:string) => type.match(/document*/i) 
export type MediaMessageListType = MessageType["listBufferBase64"] | FastMediaMessageType[]