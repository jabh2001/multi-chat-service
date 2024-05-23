import { create } from "zustand";
import { TeamType } from "../types";
import { useEffect } from "react";
import { deleteTeam, getTeams, postTeam, putTeam } from "../service/api";
import { useSSE } from "./useSSE";

type TeamStoreType = {
    firstFetch:boolean,
    teams: TeamType[]
    setTeams: (teams: TeamType[]) => void
    addTeam:(team: TeamType) => void
    updateTeam:(id:TeamType["id"], newData:Partial<TeamType>) => void
    deleteTeam:(id:TeamType["id"]) => void
}

const useTeamStore = create<TeamStoreType>((set) =>({
    firstFetch:true,
    teams: [],
    setTeams : (teams)=>set(()=>({ teams})),
    addTeam:(team) => set(state => ({ teams:[...state.teams, team]})),
    updateTeam:(id,newData)=>set(state => ({...state, teams:state.teams.map(t => t.id === id ? { ...t , ...newData} : {...t})})),
    deleteTeam: (id) => set((state) => ({ teams: state.teams.filter((teams) => teams.id !== id) })),
}))

const useTeam = ()=>{
    const multiChatSSE = useSSE()
    const store = useTeamStore()
    const {firstFetch, teams} = store

    useEffect(()=>{
        if(firstFetch){
            const getData = async () => {
                const teams = await getTeams()
                store.setTeams(teams)
            }
            getData()
        }
    }, [])
    useEffect(()=>{
        if(multiChatSSE){
            const insertListener = multiChatSSE.on("insert-team", team => store.addTeam(team))
            const updateListener = multiChatSSE.on("update-team", team => store.updateTeam(team?.id, team))
            const deleteListener = multiChatSSE.on("delete-team", ids => ids.forEach(id => store.deleteTeam(id)))

            return () => {
                multiChatSSE.remove("insert-team", insertListener)
                multiChatSSE.remove("update-team", updateListener)
                multiChatSSE.remove("delete-team", deleteListener)
            }
        }
    }, [multiChatSSE])


    return {
        teams,
        addTeam: async(newTeam:Omit<TeamType, "id">) => {
            await postTeam(newTeam)
        },
        editTeam: async(id:TeamType["id"], newData:Partial<TeamType>) => {
            await putTeam(id, newData)
        },
        deleteTeam: async(id:TeamType["id"]) => {
            await deleteTeam(id)
        }
    }
}

export default useTeamStore

export {
    useTeam,
    useTeamStore
}