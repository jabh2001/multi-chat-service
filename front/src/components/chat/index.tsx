import { createContext, useContext, useEffect, useState } from "react";
import ChatBody from "./chat-body";
import ChatFooter from "./chat-footer";
import ChatHeader from "./chat-header";
import { useConversationStore } from "../../hooks/useConversations";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../Snackbar";
import { useSSE } from "../../hooks/useSSE";

const wsURL = import.meta.env.MODE === "development" ? import.meta.env.VITE_WS_URL : import.meta.env.VITE_PROD_WS_URL

const WebSocketContext = createContext<WebSocket | undefined>(undefined);

export default function Chat(){
    const { open, color, error, message, handleClose} = useSnackbar()
    const sse = useSSE()
    const conversation = useConversationStore(state => state.conversation);
    const [ws, setWs] = useState<WebSocket | undefined>(undefined);

    useEffect(() => {
        if (conversation && sse) {
            const newWs = new WebSocket(wsURL + conversation.id);
            setWs(newWs);
            const listener = sse.on("socket-error", ({ message, socketName }) => {
                
                error(`Error with ${socketName} connection`, message)
            }) 
            return () => {
                newWs.close();
                sse.remove("socket-error", listener)
            };
        }
    }, [conversation]);
    return (
        <WebSocketContext.Provider value={ws}>
            <section className="flex flex-col flex-auto border-l border-gray-800">
                <ChatHeader />
                <ChatBody />
                <ChatFooter />
                <Snackbar open={open && message.length > 0 && message[0] !== ""} handleClose={handleClose} color={color} hiddenTimeout={30000}>

                    {
                        message.map(m => (
                            <p key={m}>{m}</p>
                        ))
                    }
                </Snackbar>
            </section>
        </WebSocketContext.Provider>
    )
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}