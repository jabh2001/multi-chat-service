import SocketPool from "./socketConnectionPool";
import { WhatsAppBaileysSocket } from "./sockets/WhatsAppBaileysSocket";

export class SocketCreator {
    constructor (private socketPool:SocketPool){

    }
    createBaileysSocket(folder: string) {
        const socket =  new WhatsAppBaileysSocket(folder);
        this.socketPool.poolMap.set(folder, socket)
        return  socket;

    }
    getOrCreateBaileysSocket(folder: string): WhatsAppBaileysSocket {
        const connection = this.socketPool.getConnection(folder)
        if (connection) {
            return connection
        } else {
            return this.createBaileysSocket(folder)
        }
    }
}