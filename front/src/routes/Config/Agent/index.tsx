import { type RouteObject } from "react-router-dom";
import { useAgent } from "../../../hooks/useAgent";
import styles from './index.module.css';
import AgentForm from "../../../components/form/AgentForm";
import SearchBar from "../../../components/SearchBar";
import { useEffect, useState } from "react";
import { AgentType, TeamType } from "../../../types";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { ActionButtons } from "../../../components/TableData/ActionButtons";
import Drawer from "../../../components/Drawer";
import AgentTeamForm from "../../../components/form/AgentTeamForm";
import { getAgentTeam } from "../../../service/api";
import useTabulatorFilters from "../../../hooks/useTabulatorFilters";

const baseName = "/config/agents"

const agentsRoutes : RouteObject[] = [
    {
        
        path:baseName,
        element:<IndexPage />
    },

];
function IndexPage(){
    const { onRef, clearFilters, include } = useTabulatorFilters()
    const [ filter, setFilter ] = useState("")
    const [openDrawer, setOpenDrawer] = useState(false)
    const [ agent, setAgent ] = useState<AgentType | undefined>()
    const [ teams, setTeams ] = useState<TeamType[]>([])
    const { agents, deleteAgent } = useAgent()
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
    const handleFilter = ()=>{
        filter == "" ? clearFilters() : include("name", filter)
    }
    const removeFilters = ()=>{
        clearFilters()
        setFilter("")
    }
    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <h3>Agent</h3>
                <SearchBar   placeholder="Search agent..."  value={filter} onChange={setFilter} onSearch={handleFilter} onRemove={removeFilters} />
                <button className="btn secondary" onClick={handleFilter}>Filtrar</button>
            </div>
            <div className={styles.agentsContainer}>
                <ReactTabulator
                    onRef={onRef}
                    options={{
                        layout:"fitColumns"
                    }}
                    columns={[
                        {title:"V", width:36, cellClick:(_e, cell) => {
                            setOpenDrawer(true)
                            setAgent(cell.getData() as any)
                        }},
                        {field:"name", title:"Nombre", widthGrow:2 },
                        {field:"email", title:"Correo",  widthGrow:3},
                        {field:"role", title:"Tipo", widthGrow:1 },
                        {title:"actions", formatter:reactFormatter(<ActionButtons onEdit={handleEdit} onDelete={handleDelete} />) }
                    ]}
                    data={agents}
                />
            </div>  
            <div className={styles.explain}>
                <AgentForm edited={edited} resetEdited={()=>setEdited(undefined)} />
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