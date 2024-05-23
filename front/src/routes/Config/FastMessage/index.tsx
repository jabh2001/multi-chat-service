import { useNavigate, type RouteObject } from "react-router-dom";
import { useFastMessage } from "../../../hooks/useFastMessage";
import styles from './index.module.css';
import FastMessageForm from "../../../components/form/FastMessageForm";
import SearchBar from "../../../components/SearchBar";
import { useState } from "react";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import useTabulatorFilters from "../../../hooks/useTabulatorFilters";
import FastMessageDetailPage from "./FastMessageDetailPage";
import { ActionButtons } from "../../../components/TableData/ActionButtons";
import { FastMessageType } from "../../../libs/schemas";

const baseName = "/config/fast-message"

const fastMessageRoute : RouteObject[] = [
    {
        path:baseName,
        element:<IndexPage />
    },
    {
        path:`${baseName}/:id`,
        element:<FastMessageDetailPage />
    }

];
function IndexPage(){
    const navigate = useNavigate()
    const { onRef, clearFilters, include } = useTabulatorFilters()
    const [ filter, setFilter ] = useState("")
    const {fastMessages, deleteFastMessage} = useFastMessage()

    const handleFilter = ()=>{
        filter == "" ? clearFilters() : include("keyWords", filter)
    }
    const handleDelete = ({ id }:FastMessageType) => deleteFastMessage(id)

    const removeFilters = ()=>{
        clearFilters()
        setFilter("")
    }
    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <h3>⚡Mensajes rápidos</h3>
                <SearchBar   placeholder="Search fastMessage..."  value={filter} onChange={setFilter} onSearch={handleFilter} onRemove={removeFilters} />
                <button className="btn secondary" onClick={handleFilter}>Filtrar</button>
            </div>
            <div className={styles.fastMessagesContainer}>
                <ReactTabulator
                    onRef={onRef}
                    options={{
                        layout:"fitColumns"
                    }}
                    columns={[
                        {title:"V", width:36, cellClick:(_evt, cell:any) => navigate(`/config/fast-message/${cell.getData().id}/`)},
                        {field:"title", title:"Nombre", widthGrow:1 },
                        {field:"keyWords", title:"palabras clave", widthGrow:2 },
                        {title:"actions", formatter:reactFormatter(<ActionButtons onDelete={handleDelete} />) }
                    ]}
                    data={fastMessages}
                />
            </div>  
            <div className={styles.explain}>
                <FastMessageForm />
            </div>
        </div>
    )
}

export default fastMessageRoute