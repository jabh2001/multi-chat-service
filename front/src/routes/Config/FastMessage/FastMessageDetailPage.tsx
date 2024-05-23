import { useMemo } from "react"
import { useFastMessage } from "../../../hooks/useFastMessage"
import { useParams } from "react-router-dom"
import styles from "./index.module.css"
import { ReactTabulator } from "react-tabulator"
import FastMessageForm from "../../../components/form/FastMessageForm"

export default function FastMessageDetailPage(){
    const { id } = useParams()
    const { fastMessages } = useFastMessage()
    const message = useMemo(() => fastMessages.find(e => e.id.toString() === id ), [fastMessages])

    return message && (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <h3>{message?.title}</h3>
            </div>
            <div className={styles.fastMessagesContainer}>
                <ReactTabulator
                    options={{
                        layout:"fitColumns"
                    }}
                    columns={[
                        {field:"text", title:"Content" },
                        {field:"base64", title:"Data" },
                        {field:"order", title:"Orden" },
                    ]}
                    data={message.fastMediaMessages || []}
                />
            </div>  
            <div className={styles.explain}>
                <FastMessageForm edit={message} />
            </div>
        </div>
    )
}