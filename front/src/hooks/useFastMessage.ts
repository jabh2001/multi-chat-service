import { create } from "zustand"
import { FastMessageType } from "../libs/schemas";
import { useEffect } from "react";
import { deleteFastMessage, getFastMessages, postFastMessage, putFastMessage } from "../service/api";
import { useSSE } from "./useSSE";
type FastMessageStoreState = {
    fastMessages: FastMessageType[]
    setFastMessages: (fastMessages: FastMessageType[]) => void
    addFastMessage: (fastMessage: FastMessageType) => void
    deleteFastMessage: (id: number) => void
    editFastMessage: (id: number, newFastMessageData: Partial<FastMessageType>) => void
}
const useFastMessageStore = create<FastMessageStoreState>((set) =>({
    fastMessages:[],
    setFastMessages: (fastMessages) => set({ fastMessages:fastMessages }),
    addFastMessage: (fastMessage) => set((state) => ({ fastMessages: [...state.fastMessages, fastMessage] })),
    deleteFastMessage: (id) => set((state) => ({ fastMessages: state.fastMessages.filter((fastMessage) => fastMessage.id !== id) })),
    editFastMessage: (id, newFastMessageData) =>
        set((state) => ({
            fastMessages: state.fastMessages.map((fastMessage) =>
                fastMessage.id === id ? { ...fastMessage, ...newFastMessageData } : fastMessage
            ),
        })),
}))

const useFastMessage = () => {
    const multiChatSSE = useSSE()
    const store = useFastMessageStore()
    const { fastMessages } = store

    useEffect(() => {
        const keySet = new Set<string>()
        for(const fastMessage of fastMessages){
            keySet.add(`${fastMessage.title}-${fastMessage.keyWords}`)
        }
        if(keySet.size !== fastMessages.length){
            // remover los duplicados
            store.setFastMessages( fastMessages.filter( (fastMessage) => {
                if( keySet.has(`${fastMessage.title}-${fastMessage.keyWords}`) ){
                    keySet.delete(`${fastMessage.title}-${fastMessage.keyWords}`)
                    return true
                } 
                return false
            } ) )

        }
    }, [fastMessages])

    useEffect(()=>{
        const getData = async () => {
            const fastMessages = await getFastMessages()
            store.setFastMessages(fastMessages as any)
        }
        getData()
    }, [])
    useEffect(()=>{
        if(multiChatSSE){
            const insertListener = multiChatSSE.on("insert-fast-message", fastMessage => {
                if(fastMessages.findIndex(fm => fm.id === fastMessage.id) === -1){
                    store.addFastMessage(fastMessage as any)
                }
            })
            const updateListener = multiChatSSE.on("update-fast-message", fastMessage => fastMessage.id && store.editFastMessage(fastMessage.id, fastMessage))
            const deleteListener = multiChatSSE.on("delete-fast-message", ids => ids.forEach(id => store.deleteFastMessage(id)))

            return () => {
                multiChatSSE.remove("insert-fast-message", insertListener)
                multiChatSSE.remove("update-fast-message", updateListener)
                multiChatSSE.remove("delete-fast-message", deleteListener)
            }
        }
    }, [multiChatSSE])


    return {
        fastMessages,
        addFastMessage: async(newFastMessage:Omit<FastMessageType, "id">) => {
            try{
                await postFastMessage(newFastMessage)
            } catch(e){
                throw e
            }
        },
        editFastMessage: async(id:FastMessageType["id"], newData:Partial<FastMessageType>) => {
            await putFastMessage(id, newData)
        },
        deleteFastMessage: async(id:FastMessageType["id"]) => {
            await deleteFastMessage(id)
        }
    }
}

export { useFastMessageStore, useFastMessage }