import { createContext, useContext, useEffect, useState } from "react";
import ChatBody from "./chat-body";
import ChatFooter from "./chat-footer";
import ChatHeader from "./chat-header";
import { useConversationStore } from "../../hooks/useConversations";

const wsURL = import.meta.env.MODE === "development" ? import.meta.env.VITE_WS_URL : import.meta.env.VITE_PROD_WS_URL

const WebSocketContext = createContext<WebSocket | undefined>(undefined);

export default function Chat(){
    const conversation = useConversationStore(state => state.conversation);
    const [ws, setWs] = useState<WebSocket | undefined>(undefined);

    useEffect(() => {
        if (conversation) {
            const newWs = new WebSocket(wsURL + conversation.id);
            setWs(newWs);
            return () => {
                newWs.close();
            };
        }
    }, [conversation]);
    return (
        <WebSocketContext.Provider value={ws}>
            <section className="flex flex-col flex-auto border-l border-gray-800">
                <ChatHeader />
                <ChatBody />
                <ChatFooter />
            </section>
        </WebSocketContext.Provider>
    )
}

export function useWebSocket() {
    return useContext(WebSocketContext);
}