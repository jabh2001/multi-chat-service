import { MenuItem, MenuSection } from "../menu"
import { HomeIcon } from "../icons"
import { useLabel } from "../../hooks/useLabelStore"
import useInboxStore from "../../hooks/useInboxStore"
import { useEffect } from "react"
import EntradasIcon from "../icons/EntradasIcon"
import LabelIcon from "../icons/LabelIcon"
import { GroupMenuItem } from "./Sidebar/items"

export function LabelSection({ basePath }:{ basePath:string }){
    const {labels} = useLabel()
    return (
        <>
            {
                labels.map((el) => {
                    return(
                        <GroupMenuItem key={`label_${el.id}`} title={el.name} to={`${basePath}?label=${el.id}`} />
                    )
                })
            }
            <GroupMenuItem title="Añadir" to="/config/labels" />
        </>
    )
}
export function InboxSection({ basePath }:{ basePath:string }){
    const inboxes = useInboxStore(state => state.inboxes)
    const fetchInboxes = useInboxStore(state => state.fetch)
    useEffect(()=>{
        fetchInboxes()
    }, [])
    return (
        <>
            {
                inboxes.map((el) => {
                    return(
                        el.id && <GroupMenuItem key={`inbox_${el.id}`} title={el.name} to={`${basePath}?inbox=${el.id}`} />
                    )
                })
            }
            <GroupMenuItem title="Añadir" to="/config/inboxes/new" />
        </>
    )
}