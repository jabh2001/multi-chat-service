import { useState } from "react";
import useMessageMedia from "./useMessageMedia";
import { useConversationStore } from "./useConversations";
import useAuth from "./useAuth";
import { convertFileToBase64 } from "../service/file";
import { useWebSocket } from "../components/chat";

const useMessageForm =  () => {
    const [ message, setMessage ] = useState("")
    const files = useMessageMedia(state => state.files)
    const reset = useMessageMedia(state => state.reset)

    const ws = useWebSocket();
    const conversationId = useConversationStore(store => store.conversation)?.id
    const user = useAuth(state => state.user)
    const contact = useConversationStore(store => store.conversation?.contact)
    const inbox = useConversationStore(store => store.conversation)?.inbox

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
        e.preventDefault();
        const  listBufferBase64 = await Promise.all(
            files.map(async (file, i) => ({ 
                messageType:file.type,
                base64:await convertFileToBase64(file),
                text:i == 0 ? message : undefined
            })
        ))
        const datosEnviar = {
            conversationId,
            contact,
            user,
            sender:user?.id || "",
            messageType: 'outgoing',
            message,
            inbox: inbox?.name,
            listBufferBase64:listBufferBase64.length === 0 ? undefined : listBufferBase64
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(datosEnviar));
            setMessage("")
            reset()
        }
    };

    const handleSendFastMessage = (fastMessageId: any) =>{
        const datosEnviar = {
            conversationId,
            contact,
            user,
            sender:user?.id || "",
            inbox: inbox?.name,
            fastMessage:fastMessageId
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(datosEnviar));
            setMessage("")
            reset()
        }
    }

    return {
        handleSubmit,
        message,
        setMessage,
        handleSendFastMessage
    }
}
export default useMessageForm