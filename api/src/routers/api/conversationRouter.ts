import { Router } from "express"
import { getConversations, leaveConversation } from "../../service/conversationService"
import { getContactAvatarUrl } from "../../service/contactService"

const conversationRouter = Router()

conversationRouter.get("/", async (req, res) => {
        try{
            const conversations = await getConversations(req.query)
            res.json({ conversations:conversations.map((c:any) => {
                const { conversation, contact, ...rest } = c
                return { ...conversation, contact:{
                    ...contact,
                    avatarUrl:getContactAvatarUrl(req, contact.id)
                }, ...rest }
            }) })
        } catch (e:any){
            return res.status(500).json({ error: e.message })
        }
    })

conversationRouter.put(("/:conversationId/leave"), async (req, res) => {
    try{
        await leaveConversation(req.identity, req.params.conversationId)
        res.json({ conversation:{
            id:req.params.conversationId,
            assignedUserId: null
        }})
    } catch (e:any){
        return res.status(500).json({ error: e.message })
    }
})

export default conversationRouter
