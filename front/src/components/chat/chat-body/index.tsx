import { useConversation } from "../../../hooks/useConversations";
import Messages from "../messages";


export default function ChatBody(){
    const { insertMessages, messagesGroup, fetchMoreMessage, rootRef, observeRef, isLoading } = useConversation();
    return (
            <div className="chat-body p-4 flex-1 flex flex-col-reverse overflow-y-scroll" ref={rootRef}>
                <Messages 
                    messages={messagesGroup}
                    addMessage={insertMessages}
                    rootRef={rootRef}
                    observeRef={observeRef}
                    fetchMoreMessage={fetchMoreMessage}
                    isLoading={isLoading} 
                />
            </div>
    )
}