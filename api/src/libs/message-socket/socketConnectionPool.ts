import fs from "fs"
import { InboxType } from "../../types"
import { InboxModel } from "../models"
import { initDBClient } from "../dataBase"
import { Socket } from "./sockets/socket"
import { SocketCreator } from "./socket-creator"

class SocketPool {
    private static instance: SocketPool
    private pool: Map<string, any> = new Map()
    private _socketCreator: SocketCreator

    private constructor() {
        this.pool = new Map()
        this.init()
        this._socketCreator = new SocketCreator(this)
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
            const conn = this.socketCreator.createBaileysSocket(inbox.name)
            const status = conn.verifyQRFolder()
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