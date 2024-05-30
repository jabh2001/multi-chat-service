import { InboxType } from "../schemas";
import SocketPool from "./socketConnectionPool";
import { TelegramTelegrafSocket } from "./sockets/TelegramTelegrafSocket";
import { WhatsAppBaileysSocket } from "./sockets/WhatsAppBaileysSocket";

export class SocketCreator {
    constructor (private socketPool:SocketPool){

    }
    createSocket({ name:folder, channelType, telegramToken}:CreateSocketParams) {
        switch (channelType) {
            case "whatsapp": return this.createBaileysSocket(folder)
            case "telegram": return this.createTelegrafSocket(folder, telegramToken)
            default: return this.createBaileysSocket(folder)
        }
    }
    createTelegrafSocket(folder:string, telegramToken?:string){
        return telegramToken ? new TelegramTelegrafSocket(folder, telegramToken) : TelegramTelegrafSocket.fromFolder(folder)
    }
    createBaileysSocket(folder: string) {
        const socket =  new WhatsAppBaileysSocket(folder);
        this.socketPool.poolMap.set(folder, socket)
        return  socket;

    }
    getOrCreateBaileysSocket(folder: string): WhatsAppBaileysSocket {
        const connection = this.socketPool.getConnection(folder)
        if (connection) {
            return connection as any
        } else {
            return this.createBaileysSocket(folder)
        }
    }
}

type CreateSocketParams = InboxType & {
    telegramToken?:string
}