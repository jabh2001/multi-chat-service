import { InboxModel } from "../libs/models";
import { InboxType, inboxSchema } from "../libs/schemas";
import SocketPool from "../libs/message-socket/socketConnectionPool";

export async function getInboxes(){
    const inboxes = await InboxModel.query.fetchAllQuery() as InboxType[]
    return await Promise.all(inboxes.map(async inbox => {
        const conn = SocketPool.getInstance().getConnection(inbox.name)
        if(!conn){
            return {}
        }
        const user = await conn.user()
        const qr = conn.getQRBase64()
        return { ...inbox, user, qr }
    }))
}

export async function saveNewInbox(inbox:Omit<InboxType, "id">){
    const newData = inboxSchema.omit({ id:true }).parse(inbox)
    const newInbox = await InboxModel.insert.value(newData).fetchOneQuery() as InboxType
    return newInbox
}

export async function getInboxById(inboxId:InboxType["id"]){
    return await InboxModel.query.filter(InboxModel.c.id.equalTo(inboxId)).fetchOneQuery() as InboxType
}

export async  function getInboxByName(inboxName:string){
    return await InboxModel.query.filter(InboxModel.c.name.equalTo(inboxName)).fetchOneQuery() as InboxType
}
export async function updateInbox(inbox:InboxType, newData:Partial<InboxType>){
    const newDataA = inboxSchema.omit({ id:true }).partial().parse(newData)
    return await InboxModel.update.values(newDataA).filter(InboxModel.c.id.equalTo(inbox.id)).fetchOneQuery() as InboxType
}
export async function deleteInbox(inboxId:InboxType["id"]){
    const inbox = await InboxModel.query.filter(InboxModel.c.id.equalTo(inboxId)).fetchOneQuery() as InboxType
    const socketPool = SocketPool.getInstance()
    const conn = socketPool.getConnection(inbox.name)
    if(conn){
        await conn.logout()
        socketPool.deleteConnection(conn)
    }
    return InboxModel.delete.filter(InboxModel.c.id.equalTo(inboxId)).fetchAllQuery()
}