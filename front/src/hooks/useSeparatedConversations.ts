import { useSearchParams } from "react-router-dom"
import { useSSE } from "./useSSE"
import { useEffect, useMemo, useState } from "react"
import { ConversationType } from "../types"
import { getAllConversations } from "../service/api"
import { create } from "zustand"
import useAuth from "./useAuth"
import { transitionViewIfSupported } from "../service/general"
import { useMessageCount } from "./useMessageCount"

type Store = {
    conversationsIds:Set<ConversationType["id"]>
    conversations:ConversationType[]
    search:string
    setSearch:(search:string) => void
    setConversation:(conversations:ConversationType[]) => void
    update:(conversationId:number, conversation:Partial<ConversationType>) => void
    setMessageCountToZero:(conversationId:any) => void
    add:(conversation:ConversationType) => void
    fetch:(obj:{ label?:string, inbox?:string}) => Promise<void>
}
export const useInnerConversationStore = create<Store>(set => {
    return ({
        conversationsIds:new Set(),
        conversations:[],
        search:"",
        setSearch:(search) => set({ search }),
        setConversation: (c) => {
            const conversationsIds = new Set<number>()
            c.forEach((conversation) => conversationsIds.add(conversation.id))
            const copy = new Set(conversationsIds)
            const conversations = c.filter(conversation => {
                if(copy.has(conversation.id)){
                    copy.delete(conversation.id)
                    return true
                }
            })
            set({conversations, conversationsIds})
        },
        update:(conversationId, conversation) => {
            set(
                state => ({ 
                    conversations:state.conversations.map(c => c.id === conversationId ? ({ ...c, ...conversation}) : ({ ...c })).sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime())
                })
            )
        },
        setMessageCountToZero(conversationId){
            set(
                state => ({ 
                    conversations:state.conversations.map(c => c.id === conversationId ? { ...c, messageCount:"0"} : { ...c })
                })
            )
        },
        add(c){
            set(state => {
                if(state.conversationsIds.has(c.id)){
                    return {...state}
                }
                return ({ conversations:state.conversations.concat(c), conversationsIds:new Set([...state.conversationsIds, c.id]) })

            })
        },
        fetch: async ({ label, inbox }) => {
            try {
                const conversations = await getAllConversations({ label, inbox })
                set({ conversations:conversations.sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime())})
            } catch (e){
                return Promise.reject(e)
            }
        }
    })
})
export default function useSeparatedConversations(){
    const setCount = useMessageCount(store => store.set)
    const search = useInnerConversationStore(store => store.search)
    const allConversations = useInnerConversationStore(store => store.conversations)
    const conversations = useMemo(() => {
        return allConversations.filter(conversation => search == "" || conversation.contact?.name?.toLowerCase().includes(search.toLowerCase()))
    }, [search, allConversations])

    const update = useInnerConversationStore(store => store.update)
    const fetch = useInnerConversationStore(store => store.fetch)
    const add = useInnerConversationStore(state => state.add)

    const user = useAuth(store => store.user)
    const userTeams = useAuth(store => store.teams)
    const [searchParams] = useSearchParams()

    const sse = useSSE()

    const [mine, setMine] = useState(new Set<number>())
    const [unassigned, setUnassigned] = useState(new Set<number>())

    const mineConversation = useMemo(() => conversations.filter(c=>mine.has(c.id)), [ mine])
    const unassignedConversation = useMemo(() => conversations.filter(c=>unassigned.has(c.id)), [ unassigned])
    

    useEffect(()=>{
        const mineSet = new Set([...mine])
        const unassignedSet = new Set([...unassigned])
        let allCount = 0
        let mineCount = 0
        let unassignedCount = 0

        for (const conversation of conversations) {
            const isUnassigned = conversation.assignedUserId === null && conversation.assignedTeamId === null
            
            const isMineAssignment = user && conversation.assignedUserId && conversation.assignedUserId === user.id
            const isTeamAssignment = userTeams && conversation.assignedTeamId && userTeams.has(conversation.assignedTeamId)
            const isMine = isMineAssignment || isTeamAssignment

            if(isMine && !mineSet.has(conversation.id)){
                mineSet.add(conversation.id)
            } else if (!isMine &&  mineSet.has(conversation.id)){
                mineSet.delete(conversation.id)
            }
            
            if(isUnassigned && !unassignedSet.has(conversation.id)){
                unassignedSet.add(conversation.id)
            } else if( !isUnassigned && unassignedSet.has(conversation.id)) {
                unassignedSet.delete(conversation.id)
            }
            if(conversation.messageCount !== "0" && conversation.messageCount !== 0){
                allCount++
                if(isMine){
                    mineCount++
                } else if(isUnassigned){
                    unassignedCount++
                }
                // allCount += +conversation.messageCount
                // if(isMine){
                //     mineCount += +conversation.messageCount
                // } else if(isUnassigned){
                //     unassignedCount += +conversation.messageCount
                // }
            }
        }
        transitionViewIfSupported(() => {
            setMine(mineSet)
            setUnassigned(unassignedSet)
            setCount({ all:allCount, mine:mineCount, unassigned:unassignedCount})
        })
    }, [conversations])

    useEffect(() => {
        fetch({ label: searchParams.get("label") ?? undefined, inbox: searchParams.get("inbox") ?? undefined })
    }, [searchParams])

    useEffect(() => {
        if (sse) {
            const listener = sse.on("update-conversation-last-message", (data) => {
                const { conversationId, lastMessage, lastMessageDate } = data
                update(conversationId, {lastMessage, lastMessageDate })
            })
            const updateListener = sse.on("update-conversation", (conversation) => {
                update(conversation.id, {...conversation})
            })
            const addListener = sse.on("insert-conversation", (conversation) => {
                add(conversation)
                
            })
            return () => { 
                sse.remove("update-conversation-last-message", listener)
                sse.remove("update-conversation", updateListener)
                sse.remove("insert-conversation", addListener)
            }
        }
    }, [sse])

    return {
        conversations,
        mineConversation,
        unassignedConversation,
        update,
    }
}