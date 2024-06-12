import { getClientList } from "../app";
import { ConversationModel, InboxModel, MessageModel, UserModel } from "../libs/models";
import { MessageType, messageSchema } from "../libs/schemas";
import SocketPool from "../libs/message-socket/socketConnectionPool";
import { ContactType, ConversationType, InboxType } from "../types";
import { getConversationUnreadMessageCountById, saveNewConversation } from "./conversationService";
const sseClients = getClientList()

export async function getMessageByConversation(conversationId:any, offset:number=0){
    const query = (
        MessageModel.query.filter(MessageModel.c.conversationId.equalTo(conversationId))
        .join(UserModel, UserModel.c.id, MessageModel.c.senderId, "LEFT")
        .offset(offset)
        .limit(20)
        .order(MessageModel.c.id.desc())
    )
    return await query.fetchAllQuery<MessageType>()
}
export async function saveNewMessageInConversation(conversationId:any, message:any){
    
    const newData = messageSchema.omit({ id:true, conversationId:true }).parse(message)
    const newMessage =  await MessageModel.insert.value({ ...newData, conversationId }).fetchOneQuery<MessageType>()
    sseClients.emitToClients("update-conversation-last-message", {conversationId, lastMessage:newMessage.content || "", lastMessageDate:String(newMessage.createdAt)})
    const { messageCount } = await getConversationUnreadMessageCountById(conversationId)
    sseClients.emitToClients("update-conversation", { id:conversationId, messageCount })
    return newMessage
}

export async function getMessageByWhatsAppId(whatsAppId:string) {
    return await MessageModel.query.filter(MessageModel.c.whatsappId.equalTo(whatsAppId)).fetchAllQuery()
}

export async function sendMessageToContact(contact:ContactType, { inboxName, message }:{ inboxName:string, message:string}){
    
    const inbox = await InboxModel.query.filter(InboxModel.c.name.equalTo(inboxName)).fetchOneQuery<InboxType>()
    if(!inbox){
        throw new Error("No inbox found")
    }
    const conn = SocketPool.getInstance().socketCreator.getOrCreateBaileysSocket(inbox.name)

    const conversations = await (
        ConversationModel.query
        .filter(ConversationModel.c.inboxId.equalTo(inbox.id), ConversationModel.c.senderId.equalTo(contact.id))
        .fetchAllQuery<ConversationType>()
    )
    const conversation = conversations.length > 0 ? conversations[0] : await saveNewConversation({ inboxId:inbox.id, senderId:contact.id, assignedUserId:1 } as any)
    const msg = {
        conversationId:conversation.id,
        content:message,
        contentType:"text",
        messageType:"outgoing" as "outgoing",
        whatsappId:"",
        private:true,
    }
    const phone = contact.phoneNumber
    const sendMsg = await conn.sendMessage(contact.phoneNumber.slice(1), msg)
    const result = await saveNewMessageInConversation(conversation.id, sendMsg)
    return result
}

export const viewMessageInConversation = async (conversationId:any) => {
    const query = MessageModel.update.values({ status:true }).filter(MessageModel.c.conversationId.equalTo(conversationId)).execute()
    await query
    const { messageCount } = await getConversationUnreadMessageCountById(conversationId)
    sseClients.emitToClients("update-conversation", {id:conversationId, messageCount})
    return true
}