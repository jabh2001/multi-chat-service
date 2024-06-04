import { useRef, useState } from "react"
import { menuContext } from "../../hooks/useMenu"
import styles from "./index.module.css"
import { ButtonListItem, ListItem } from "./ListItem"
import { MenuItem } from "../menu"
import {  CommentIcon, ConfigIcon, HomeIcon, PhoneIcon } from "../icons"
import { InboxSection, LabelSection } from "./sections"
import RightFromBracket from "../icons/RightFromBracket"
import useAuth from "../../hooks/useAuth"
import AgentIcon from "../icons/AgentIcon"
import EntradasIcon from "../icons/EntradasIcon"
import LabelIcon from "../icons/LabelIcon"


export default function VerticalNavBar(){
    const signOut = useAuth(store => store.signOut)
    const optionsRef = useRef<HTMLDivElement>(null)
    const [openedMenuName, setOpenedMenuName] = useState("off")
    return (
        <menuContext.Provider value={{ ref:optionsRef, openedMenuName, setOpenedMenuName}}>
            <div className={styles.navbarContainer}>

                <ul className={styles.navbar}>
                    <ListItem icon={<CommentIcon />} title="Conversaciones" name="conversations">
                        <MenuItem icon={<HomeIcon />} title="All" to="/conversations" />
                        <MenuItem icon={<PhoneIcon />} title="Pending" to="/conversations/pending" />
                        <InboxSection basePath="conversations" />
                        <LabelSection basePath="conversations" />
                    </ListItem>
                    <ListItem icon={<PhoneIcon />} title="Contactos" name="contacts">
                        <MenuItem icon={<PhoneIcon />} title="Ver todos" to="/contacts" />
                        <LabelSection basePath="contacts" />
                    </ListItem>
                    {/* <ListItem icon={<HomeIcon />} title="" name="A2"></ListItem> */}
                    <ListItem icon={<ConfigIcon />} title="Configuraciones" name="config">
                        {/* <MenuItem icon={<HomeIcon />} title="Cuenta" to="/config/account" /> */}
                        <MenuItem icon={<AgentIcon />} title="Agentes" to="/config/agents" />
                        <MenuItem icon={<EntradasIcon />} title="Entradas" to="/config/inboxes" />
                        <MenuItem icon={<LabelIcon />} title="Etiquetas" to="/config/labels" />
                        <MenuItem icon={<HomeIcon />} title="Equipos" to="/config/teams" />
                        <MenuItem icon={<HomeIcon />} title="Mensajes rápidos" to="/config/fast-message" />
                    </ListItem>
                    <span className={styles.separator}></span>
                    {/* <ButtonListItem onClick={testCookie}><BellIcon /></ButtonListItem> */}
                    <ButtonListItem onClick={signOut}><RightFromBracket /></ButtonListItem>
                    {/* <LinkListItem to="/sign-out"><RightFromBracket /></LinkListItem> */}
                </ul>
                {/* <div className={openedMenuName === "off" ? styles.closeMenuOption} ref={optionsRef}></div */}
                <div className={`${styles.menuOption} ${openedMenuName === "off" && styles.closeMenuOption}`} ref={optionsRef}></div>
            </div>
        </ menuContext.Provider>
    )
}