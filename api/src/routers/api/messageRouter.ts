import { applyTo, getClientList } from "../../app";
import { Router } from "express";
import SocketPool from "../../libs/message-socket/socketConnectionPool";
import { getAsignedUserByIdSchema, updateInboxConversation } from "../../service/conversationService";
import { getInboxByName } from "../../service/inboxService";
import WS from "../../libs/message-socket/websocket-adapter";
import { SocketError } from "../../libs/message-socket/sockets/errors";

const clients = getClientList()
const messageWsRouter = Router()

messageWsRouter.ws('/conversation/:id', async (ws, rq) => {
    const poll = SocketPool.getInstance()
    ////
    // este es el que se debe enviar a baileys
    ////
    ws.on('message', async (data) => {
        try {
            const jsonData = JSON.parse(data.toString());
            if(jsonData.assignedUserId == null){
                const inbox = await getInboxByName(jsonData.inbox);
                const conversation = await getAsignedUserByIdSchema(inbox.id, jsonData.contact.id) as any
                conversation.assignedUserId = jsonData.user.id
                delete conversation.contact
                await updateInboxConversation(conversation.id!, conversation)
                clients.emitToClients("update-conversation", conversation)

            }
            const socket = poll.getConnection(jsonData.inbox)
            if(!socket){
                return 
            }
            const result = await WS.outgoingMessage(jsonData, socket)
            if(Array.isArray(result)){
                for(const res of result){
                    ws.send(JSON.stringify(res))
                }
            } else {

                ws.send(JSON.stringify(result))
            }
        } catch (error) {
            if(error instanceof SocketError){
                clients.emitToClients("socket-error", {message: error.message, socketName:error.socket.folder })

            }
            console.error("Error parsing JSON:", error);
        }
    });
    ws.on('message-upsert'+rq.params.id,async(data: string)=>{
        ws.send(data)   
    })
})

applyTo(messageWsRouter)

export default messageWsRouter