import { Tab, Tabs } from "../Tab";
import styles from './contactHeader.module.css'
import { useConversationStore } from "../../hooks/useConversations";


export default function ContactHeader({ tab, setTab }:{ tab:any, setTab:any}) {
    const contact = useConversationStore(state => state.contact)
    const conversation = useConversationStore(state => state.conversation)
    return <div className={styles.contactHeader}>
        <div className={styles.headerContainer}>
            <div className={styles.headerInfo}>
                <h3>{contact?.name}</h3>
                <div className={styles.inboxName}>

                    <p>{ conversation?.inbox?.name ?? "No hay conversación seleccionada"}</p>

                </div>
            </div>

        </div>
        <Tabs value={tab} setValue={setTab}>
            <Tab name="Mensajes" value={1}/>
            <Tab name="Notas" value={2} />
        </Tabs>
    </div>
}