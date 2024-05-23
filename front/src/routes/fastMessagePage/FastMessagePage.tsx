import { useEffect, useState } from "react"
import { getAllFastMessages } from "../../service/api"
import { FastMessageType } from "../../libs/schemas";

export default function FastMessagePage() {
    const [messages, setMessages] = useState<FastMessageType[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await getAllFastMessages()
                setMessages(messages)
            } catch (error) {
                console.error('Error al obtener mensajes:', error);
            }
        };

        fetchMessages();
    }, []);


    return (
        <div>
            FastMessagePage
            <p>esto es un mensaje</p>
            {messages.map((e) => {
                return <div key={e.id}>
                    <h3>{e.title}</h3>
                    <p >{e.keyWords} </p>
                </div>
            })}
        </div>
    )
}
