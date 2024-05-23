import { create } from "zustand"
import { InboxType } from "../types"
import { getInboxes } from "../service/api"


type InboxStoreType = {
    inboxes: InboxType[]
    fetch:()=>Promise<void>
    setInboxes: (inboxes: InboxType[]) => void
    addInbox:(inbox: InboxType) => void
    deleteInbox:(id:InboxType["id"]) => void
    updateInbox:(inbox:InboxType) => void
    updateInboxByName:(inbox:Omit<InboxType, "id">) => void
}

const useInboxStore = create<InboxStoreType>((set) =>({
    inboxes: [],
    fetch:async () => {
        const inboxes = await getInboxes()
        set({ inboxes })
    },
    setInboxes : (inboxes)=>set(()=>({ inboxes})),
    addInbox:(inbox) => set(state => ({ inboxes:[...state.inboxes, inbox]})),
    deleteInbox: (id) => set((state) => ({ inboxes: state.inboxes.filter((inbox) => inbox.id !== id) })),
    updateInbox: (data) =>
        set((state) => ({
            inboxes: state.inboxes.map((inbox) =>
                inbox.id === data.id ? data : inbox
            ),
        })),
    updateInboxByName: (data) =>
        set((state) => ({
            inboxes: state.inboxes.map((inbox) =>
                inbox.name === data.name ? {...inbox, ...data} : {...inbox}
            ),
        })),
}))

export default useInboxStore