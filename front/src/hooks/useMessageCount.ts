import { create } from "zustand"

type Store = {
    unassigned:number
    mine:number
    all:number
    set:(data:{unassigned:number, mine:number, all:number}) => void
}
export const useMessageCount = create<Store>(set => {
    return ({
        unassigned:0,
        mine:0,
        all:0,
        set(data){
            set(data)
        }
    })
})