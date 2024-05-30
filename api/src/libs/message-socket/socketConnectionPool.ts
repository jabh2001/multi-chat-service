import fs from "fs"
import { InboxModel } from "../models"
import { initDBClient } from "../dataBase"
import { Socket } from "./sockets/socket"
import { SocketCreator } from "./socket-creator"
import { InboxType } from "../schemas"

class SocketPool {
    private static instance: SocketPool
    private pool: Map<string, Socket> = new Map()
    private _socketCreator: SocketCreator

    private constructor() {
        this.pool = new Map()
        this._socketCreator = new SocketCreator(this)
        this.init()
    }

    get socketCreator(){
        return  this._socketCreator
    }
    get poolMap(){
        return this.pool
    }

    async init() {
        await initDBClient()
        const inboxes = await InboxModel.query.fetchAllQuery<InboxType>()
        for (const inbox of inboxes) {
            const conn = this.socketCreator.createSocket(inbox)
            if(!conn)
                continue
            this.pool.set(inbox.name, conn)
            const status = conn && conn.verifyQRFolder()
            if (status) {
                const watch = fs.watch(conn.qr_folder)
                watch.on("change", () => {
                    conn.sentCreds()
                })
            }
        }
    }

    static getInstance() {
        if (!SocketPool.instance) {
            SocketPool.instance = new SocketPool();
        }
        return SocketPool.instance;
    }

    getConnection(folder: string) {
        return this.pool.get(folder)
    }
    deleteConnection(conn:string | Socket){
        if(conn instanceof Socket){
            this.pool.delete(conn.folder)
        } else {
            this.pool.delete(conn)
        }
    }
}

export default SocketPool