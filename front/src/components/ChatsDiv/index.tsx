import { ConversationType } from "../../types";
import ChatCard from "../chatCard/chatCard";
import { useConversationStore } from "../../hooks/useConversations";
import { useInnerConversationStore } from "../../hooks/useSeparatedConversations";


export default function ChatsDiv({ conversations, prefix }:{ conversations:ConversationType[], prefix:string }){
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)
    const setMessageCountToZero = useInnerConversationStore(state => state.setMessageCountToZero)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        setMessageCountToZero(conversation.id)
    }

    return <>
        {
            conversations.map((c) => (
                <ChatCard
                    key={`chat_all_${c.id}`}
                    viewTransitionName={`${prefix}${c.id}`}
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
export function ChatMine({ conversations }:{ conversations:ConversationType[] }) {
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)
    const setMessageCountToZero = useInnerConversationStore(state => state.setMessageCountToZero)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        setMessageCountToZero(conversation.id)
    }

    return <>
        {
            conversations.map((c) => (
                <ChatCard
                    key={`chat_all_${c.id}`}
                    viewTransitionName={`chatCardMine${c.id}`}
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
export function ChatUnassigned({ conversations }:{ conversations:ConversationType[] }) {
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)
    const setMessageCountToZero = useInnerConversationStore(state => state.setMessageCountToZero)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        setMessageCountToZero(conversation.id)
    }

    return <>
        {
            conversations.map((c) => (
                <ChatCard
                    key={`chat_all_${c.id}`}
                    viewTransitionName={`chatCardUnassigned${c.id}`}
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
export function ChatAll({ conversations }:{ conversations:ConversationType[]}) {
    const setConversationId = useConversationStore(state => state.setConversationId)
    const setContact = useConversationStore(state => state.setContact)
    const setMessageCountToZero = useInnerConversationStore(state => state.setMessageCountToZero)

    const handleClick = (conversation: ConversationType) => {
        setConversationId(conversation)
        setContact(conversation.contact)
        setMessageCountToZero(conversation.id)
    }

    return <>
        {
            conversations.map((c) => (
                <ChatCard
                    key={`chat_all_${c.id}`}
                    viewTransitionName={`chatCardAll${c.id}`}
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