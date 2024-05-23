import { type RouteObject } from "react-router-dom";
import styles from './index.module.css';
import SearchBar from "../../../components/SearchBar";
import TeamForm from "../../../components/form/TeamForm";
import { useTeam } from "../../../hooks/useTeamStore";
import { useState } from "react";
import { TeamType } from "../../../types";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import { ActionButtons } from "../../../components/TableData/ActionButtons";
import useTabulatorFilters from "../../../hooks/useTabulatorFilters";

const baseName = "/config/teams"

const teamRoutes : RouteObject[] = [
    {
        
        path:baseName,
        element:<IndexPage />
    },

];
// function useTabulatorFilter

function IndexPage(){
    const { onRef, clearFilters, include } = useTabulatorFilters()
    const [ filter, setFilter ] = useState("")
    const { teams, deleteTeam } = useTeam()
    const [edited, setEdited] = useState<TeamType | undefined>(undefined)

    const handleEdit = (row:TeamType) => setEdited(row)
    const handleDelete = ({ id }:TeamType) => deleteTeam(id)
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
                <h3>Team</h3>
                <SearchBar placeholder="Search team..." value={filter} onChange={setFilter} onSearch={handleFilter} onRemove={removeFilters} />
                <button className="btn secondary" onClick={handleFilter}>Filtrar</button>
            </div>
            <div className={styles.labelsContainer}>
                <ReactTabulator
                    onRef={onRef}
                    options={{
                        layout:"fitColumns"
                    }}
                    columns={[
                        {field:"name", "title":"Nombre", widthGrow:2},
                        {field:"description", "title":"Descripción", widthGrow:3},
                        {title:"actions", formatter:reactFormatter(<ActionButtons onEdit={handleEdit} onDelete={handleDelete} />), widthShrink:2}
                    ]}
                    data={teams}
                />
            </div>
            <div className={styles.explain}>
                <TeamForm edited={edited} resetEdited={()=>setEdited(undefined)} />
            </div>
        </div>
    )
}

export default teamRoutes