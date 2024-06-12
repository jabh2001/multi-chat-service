import { forwardRef } from "react";
import styles from './index.module.css'
import { MessageType } from "../../types";
import GalleryImage from "../GalleryImage/GalleryImage";
import ChatAudioPlayer from "../ChatAudioPlayer";
import ChatVideoPlayer from "../VideoPlayer/VidePlayer";
import ChatDocumentMessage from "../ChatDocumentMessage";
import { useConversationStore } from "../../hooks/useConversations";
import CircleAvatar from "../avatar/CircleAvatar";

interface ChatMessageProps {
    message: MessageType
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ message }: ChatMessageProps, ref) => {
    const contact = useConversationStore(store => store.contact)
    return (
        <div className={styles.container} ref={ref} id={`message-${message.id}`}>
            { 
                contact && message.messageType === "incoming" && (
                    <div className="h-full flex flex-col justify-end w-16 p-2">
                        <CircleAvatar src={contact.avatarUrl} alt={contact.name} /> 
                    </div>
                )
            }
            <div className={`${styles.message} ${message.messageType === "incoming" ? styles.incoming : styles.outgoing} ${!message.private && styles.whatsapp}`}>
                { message.user?.name && <p className={styles.messageUsername}><span className={styles.whiteText}>{`${message.user.name}`}</span></p> }

                {message.buffer && message.contentType === 'imageMessage' && (
                    <>
                        <p className={styles.whiteText}>{message.content}</p>
                        <GalleryImage src={`data:image/jpeg;base64,${message.buffer}`} alt="Message Image" />
                    </>
                )}
                {message.buffer && message.contentType === 'audioMessage' && (
                    <ChatAudioPlayer msg={message} />
                )}
                {message.buffer && message.contentType === 'videoMessage' && (
                    <ChatVideoPlayer src={`data:video/mp4;base64,${message.buffer}`} /> 
                )}
                {message.buffer && message.contentType === 'documentMessage' && (
                    <ChatDocumentMessage msg={message} /> 
                )}
                {message.contentType == "text" && message.content !== 'undefined' && (
                    <p className={styles.whiteText}>{message.content}</p>
                )}
            </div>
        </div>
    );
})

export default ChatMessage;