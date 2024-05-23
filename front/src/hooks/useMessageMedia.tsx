import { create } from "zustand";

type MessageMediaType = {
    files:File[]
    appendFile:(f:File) => void
    appendFiles:(...f:File[]) => void
    deleteFile:(f:number | File) => void
    reset:() =>  void
}
const useMessageMedia = create<MessageMediaType>((set) => ({
    files:[],
    appendFile(file){
        set(({ files}) => {
            return ({ 
                files: [...files, file] 
            })
        })
    },
    appendFiles(...file){
        set(({ files}) => ({ files: [...files, ...file] }))
    },
    deleteFile(indexOrFile){
        set(state => ({
            files: state.files.filter((f, i) => {
                if (typeof indexOrFile === 'number' && indexOrFile === i) return false;
                else if (indexOrFile instanceof File &&  indexOrFile.name === f.name) return false
                return true
            }) 
        }))
    },
    reset(){
        set({ files : []})
    }
}))

export default useMessageMedia