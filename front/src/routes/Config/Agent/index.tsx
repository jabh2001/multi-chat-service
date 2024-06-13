import { type RouteObject } from "react-router-dom";
import { useAgent } from "../../../hooks/useAgent";
import AgentForm from "../../../components/form/AgentForm";
import { useEffect, useMemo, useState } from "react";
import { AgentType, TeamType } from "../../../types";
import Drawer from "../../../components/Drawer";
import AgentTeamForm from "../../../components/form/AgentTeamForm";
import { getAgentTeam } from "../../../service/api";
import HeaderSearchBar from "../../../components/HeaderSearchBar";
import PencilIcon from "../../../components/icons/PencilIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import LabelIcon from "../../../components/icons/LabelIcon";
import { ProfileIcon } from "../../../components/icons";
import { useDebounce } from "../../../hooks/useDebounce";

const baseName = "/config/agents"

const agentsRoutes : RouteObject[] = [
    {
        
        path:baseName,
        element:<IndexPage />
    },

];
function IndexPage(){
    const [ filter, setFilter ] = useState("")
    const debounceFilter = useDebounce(filter)
    const [ openDrawer, setOpenDrawer] = useState(false)
    const [ agent, setAgent ] = useState<AgentType | undefined>()
    const [ teams, setTeams ] = useState<TeamType[]>([])
    const { agents:rawAgents, deleteAgent } = useAgent()

    const agents = useMemo(() => rawAgents.filter(agent => {
        return agent.name.toLowerCase().includes(filter.toLowerCase()) ||  agent.email.toLowerCase().includes(filter.toLowerCase())
    } ), [debounceFilter, rawAgents])

    const [edited, setEdited] = useState<AgentType | undefined>(undefined)

    useEffect(()=>{
        const getDate = async ()=>{
            if(agent){
                const teams = await getAgentTeam(agent.id)
                setTeams(teams)
            }
        }
        getDate()
    }, [agent])
    

    const handleEdit = (row:AgentType) => setEdited(row)
    const handleDelete = ({ id }:AgentType) => deleteAgent(id)
    return (
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                <HeaderSearchBar placeholder="Search agents" value={filter} onChange={setFilter} onRemove={()=>setFilter("")} />
                <div>
                    <div className="flex justify-center pt-8">
                        <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                            <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                                <h4 className="text-xl font-semibold text-black">
                                    Lista de agentes
                                </h4>
                            </div>

                            <div className="grid grid-cols-6 border-b border-slate-300 py-4 px-4  md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Nombre</p>
                                </div>
                                <div className="col-span-1 hidden items-center sm:flex">
                                    <p className="font-medium">Correo</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Tipo</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Etiquetas</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Editar</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Eliminar</p>
                                </div>
                            </div>
                            <div className="max-h-[65vh] overflow-y-scroll">
                                {agents.map((agent) => (
                                    <div
                                        className="grid grid-cols-6 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6"
                                        key={"contact_" + agent.id}
                                    >
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {agent.name}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {agent.email}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {agent.role}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <button className="btn primary" onClick={() => {
                                                setOpenDrawer(true)
                                                setAgent(agent)
                                            }}>
                                                <LabelIcon />
                                            </button>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <button className="btn warning" onClick={() => handleEdit(agent)}>
                                                <PencilIcon />
                                            </button>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <button className="btn error" onClick={() => handleDelete(agent)}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="bg-white border-gray-200 p-4 border-l-2">
                <div className="flex justify-start items-center gap-4 text-primary fill-primary text-xl font-bold ">
                    <div>
                        <ProfileIcon />
                    </div>
                    <h3>Nuevo agente</h3>
                </div>
                <div>
                    <AgentForm edited={edited} resetEdited={()=>setEdited(undefined)} />
                </div>
            </div>
            <Drawer open={openDrawer && !!agent} onClose={ ()=>setOpenDrawer(false)}>
                <div>
                    {agent && teams && <AgentTeamForm  agentId={agent.id} name={agent.name} teams={teams} setTeams={(teams:any) => setTeams(teams)} />}
                </div>
            </Drawer>
        </div>
    )
}

export default agentsRoutes