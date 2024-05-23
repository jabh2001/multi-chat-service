import { MenuItem, MenuSection } from "../menu"
import { HomeIcon, PhoneIcon } from "../icons"
import { useLabel } from "../../hooks/useLabelStore"
import useInboxStore from "../../hooks/useInboxStore"
import { useEffect } from "react"

export function LabelSection({ basePath }:{ basePath:string }){
    const {labels} = useLabel()
    return (
        <MenuSection title="Etiquetas">
            {
                labels.map((el) => {
                    return(
                        <MenuItem key={`label_${el.id}`} icon={<PhoneIcon />} title={el.name} to={`${basePath}?label=${el.id}`} />
                    )
                })
            }
            <MenuItem icon={<HomeIcon />} title="Añadir" to="/config/labels" />
        </MenuSection>
    )
}
export function InboxSection({ basePath }:{ basePath:string }){
    const inboxes = useInboxStore(state => state.inboxes)
    const fetchInboxes = useInboxStore(state => state.fetch)
    useEffect(()=>{
        fetchInboxes()
    }, [])
    return (
        <MenuSection title="Entradas">
            {
                inboxes.map((el) => {
                    return(
                        <MenuItem key={`inbox_${el.id}`} icon={<PhoneIcon />} title={el.name} to={`${basePath}?inbox=${el.id}`} />
                    )
                })
            }
            <MenuItem icon={<HomeIcon />} title="Añadir" to="/config/inboxes/new" />
        </MenuSection>
    )
}