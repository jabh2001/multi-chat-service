/* eslint-disable react-refresh/only-export-components */
import { useConversation, useConversationStore } from "../../hooks/useConversations";
import styles from './index.module.css'
import MessageList from "../MessageList";
import ContactHeader from "../contactHeader/contactHeader";
import MessageForm from "../messageForm/messageForm";
import { createContext, useState, useEffect, useContext } from "react";
import NoteList from "../NoteList";

const WebSocketContext = createContext<WebSocket | undefined>(undefined);
function ChatContainer() {
    const { insertMessages, fetchMoreMessage, messages, rootRef, observeRef, isLoading } = useConversation();
    const conversation = useConversationStore(state => state.conversation);
    const [ws, setWs] = useState<WebSocket | undefined>(undefined);
    const [ tab, setTab] = useState(1)

    useEffect(() => {
        if (conversation) {
            const newWs = new WebSocket('ws://localhost:3000/ws/conversation/' + conversation.id);
            setWs(newWs);

            return () => {
                newWs.close();
            };
        }
    }, [conversation]);

    return (
        <WebSocketContext.Provider value={ws}>
            <ContactHeader tab={tab} setTab={setTab} />
            {
                tab == 1 ?(
                    <div className={styles.layout} ref={rootRef}>
                        <MessageList messages={messages} addMessage={insertMessages} rootRef={rootRef} observeRef={observeRef} fetchMoreMessage={fetchMoreMessage} isLoading={isLoading} />
                    </div>
                ) : tab == 2 ? (
                    <div className={styles.layout}>
                        <NoteList />
                    </div>
                ) : null
            }
            <MessageForm />
        </WebSocketContext.Provider>
    );
}
export function useWebSocket() {
    return useContext(WebSocketContext);
}

export default ChatContainer