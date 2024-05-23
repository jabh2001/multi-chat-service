import { TabsSlider, Tab as TabView } from "../TabsSlider";
import { ConversationType } from "../../types";
import ChatCard from "../chatCard/chatCard";
import style from "./index.module.css"
import { useConversationStore } from "../../hooks/useConversations";
import useSeparatedConversations from "../../hooks/useSeparatedConversations";

export default function ChatsDiv({ tab }: { tab: number }) {
    const { conversations, mineConversation, unassignedConversation, update } = useSeparatedConversations()
    return (
        <div className={style.chatsContainer}>
            <div className={style.conversationsContainer}>

                <TabsSlider page={tab}>
                    <TabView visible={tab == 1}>
                        <div className={style.conversationsSectionContainer}>
                            <ChatMine conversations={mineConversation} update={update}/>
                        </div>
                    </TabView>
                    <TabView visible={tab == 2}>
                        <div className={style.conversationsSectionContainer}>
                            <ChatUnassigned conversations={unassignedConversation} update={update}/>
                        </div>
                    </TabView>
                    <TabView visible={tab == 3}>
                        <div className={style.conversationsSectionContainer}>
                            <ChatAll conversations={conversations} update={update}/>
                        </div>
                    </TabView>
                </TabsSlider>
            </div>
        </div>
    )
}

function ChatMine({ conversations, update }:{ conversations:ConversationType[], update:any}) {
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        update(conversation.id, { messageCount:"0"})
    }

    return <>
        {
            conversations.map((c) => (
                <ChatCard
                    key={`chat_all_${c.id}`}
                    viewTransitionName={`chatCardMine${c.id}`}
                    inboxName={c.inbox?.name ?? ""}
                    contactName={c.contact?.name ?? ""}
                    shortMessage={c.lastMessage}
                    avatarUrl={c.contact.avatarUrl}
                    onClick={() => handleClick(c)}
                    messageCount={c.messageCount.toString()}
                />
            ))
        }
    </>
}
function ChatUnassigned({ conversations, update }:{ conversations:ConversationType[], update:any}) {
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        update(conversation, { messageCount:"0"})
    }

    return <>
        {
            conversations.map((c) => (
                <ChatCard
                    key={`chat_all_${c.id}`}
                    viewTransitionName={`chatCardUnassigned${c.id}`}
                    inboxName={c.inbox?.name ?? ""}
                    contactName={c.contact?.name ?? ""}
                    shortMessage={c.lastMessage}
                    avatarUrl={c.contact.avatarUrl}
                    onClick={() => handleClick(c)}
                    messageCount={c.messageCount.toString()}
                />
            ))
        }
    </>
}
function ChatAll({ conversations, update }:{ conversations:ConversationType[], update:any}) {
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        update(conversation, { messageCount:"0"})
    }

    return (
        <>
            {
                conversations.map((c) => (
                    <ChatCard
                        key={`chat_all_${c.id}`}
                        viewTransitionName={`chatCardAll${c.id}`}
                        inboxName={c.inbox?.name ?? ""}
                        contactName={c.contact?.name ?? ""}
                        shortMessage={c.lastMessage}
                        avatarUrl={c.contact.avatarUrl}
                        onClick={() => handleClick(c)}
                        messageCount={c.messageCount.toString()}
                    />
                ))
            }
        </>
    )
}