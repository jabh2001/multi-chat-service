import { create } from "zustand"
import { LabelType } from "../types"
import { useEffect } from "react"
import { deleteLabel, getLabels, postLabel, putLabel } from "../service/api"
import { useSSE } from "./useSSE"


type LabelStoreType = {
    firstFetch:boolean,
    labels: LabelType[]
    setLabels: (labels: LabelType[]) => void
    addLabel:(label: LabelType) => void
    updateLabel:(id:LabelType["id"], newData:Partial<LabelType>) => void
    deleteLabel:(id:LabelType["id"]) => void
}

const useLabelStore = create<LabelStoreType>((set) =>({
    firstFetch:true,
    labels: [],
    setLabels : (labels)=>set(()=>({ labels, firstFetch:false})),
    addLabel:(label) => set(state => ({ labels:[...state.labels, label]})),
    updateLabel:(id,newData)=>set(state => ({...state, labels:state.labels.map(l => l.id === id ? { ...l , ...newData} : {...l})})),
    deleteLabel: (id) => set((state) => ({ labels: state.labels.filter((labels) => labels.id !== id) })),
}))

const useLabel = () => {
    const multiChatSSE = useSSE()
    const store = useLabelStore()
    const {firstFetch, labels} = store

    useEffect(() => {
        const nameSet = new Set<string>()
        for(const label of labels){
            nameSet.add(label.name)
        }
        if(nameSet.size !== labels.length){
            // remover los duplicados
            store.setLabels( labels.filter( (label) => {
                if( nameSet.has(label.name) ){
                    nameSet.delete(label.name)
                    return true
                } 
                return false
            } ) )

        }
    }, [labels])

    useEffect(()=>{
        if(firstFetch){
            const getData = async () => {
                const labels = await getLabels()
                store.setLabels(labels)
            }
            getData()
        }
    }, [])
    useEffect(()=>{
        if(multiChatSSE){
            const insertListener = multiChatSSE.on("insert-label", label => store.addLabel(label))
            const updateListener = multiChatSSE.on("update-label", label => store.updateLabel(label?.id, label))
            const deleteListener = multiChatSSE.on("delete-label", ids => ids.forEach(id => store.deleteLabel(id)))

            return () => {
                multiChatSSE.remove("insert-label", insertListener)
                multiChatSSE.remove("update-label", updateListener)
                multiChatSSE.remove("delete-label", deleteListener)
            }
        }
    }, [multiChatSSE])




    return {
        labels,
        addLabel: async(newLabel:Omit<LabelType, "id">) => {
            try{
                await postLabel(newLabel)
            } catch(e){
                console.error(`Error adding label ${JSON}`)
            }
        },
        editLabel: async(id:LabelType["id"], newData:Partial<LabelType>) => {
            await putLabel(id, newData)
        },
        deleteLabel: async(id:LabelType["id"]) => {
            await deleteLabel(id)
        }
    }
}

export default useLabelStore
export {
    useLabelStore,
    useLabel,
}