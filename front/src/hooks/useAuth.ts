import { create } from "zustand";
import { UserType } from "../types";
import { signIn, signOut } from "../service/api";
const USER_KEY = "multi-chat-user-auth-storage"
type Store = {
    user:UserType | null,
    teams:Set<number> | null
    signIn:(email:string, password:string)=>Promise<boolean>
    signOut:()=>Promise<boolean>
}
const useAuth = create<Store>((set) => {
    const user = JSON.parse(String(sessionStorage.getItem(USER_KEY)))
    return {
        user,
        teams:new Set(user?.teams?.map((t:any)=>t.id)),
        signIn:async (email, password) => {
            try{
                const { user } = await signIn(email, password)
                set({ user })
                set({ teams:new Set(user?.teams?.map(t=>t.id))})
                sessionStorage.setItem(USER_KEY, JSON.stringify(user))
                return true
            } catch (e){
                return Promise.reject(e)
            }
        },
        signOut:async () => {
            try{
                const { status } = await signOut()
                if(status) {
                    set({ user:null })
                    sessionStorage.setItem(USER_KEY, JSON.stringify(null))
                }
                return status
            } catch (e){
                return false
            }
        }
    }
})

export default useAuth