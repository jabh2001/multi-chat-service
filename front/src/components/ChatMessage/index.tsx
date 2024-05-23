import { forwardRef } from "react";
import styles from './index.module.css'
import { MessageType } from "../../types";
import GalleryImage from "../GalleryImage/GalleryImage";
import ChatAudioPlayer from "../ChatAudioPlayer";

interface ChatMessageProps {
    message: MessageType
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ message }: ChatMessageProps, ref) => {
    return (
        <div className={styles.container} ref={ref} id={`message-${message.id}`}>
            <div className={`${styles.message} ${message.messageType === "incoming" ? styles.incoming : styles.outgoing} ${!message.private && styles.whatsapp}`}>
                { message.user?.name && <p className={styles.messageUsername}><span>{`${message.user.email} - ${message.user.name}`}</span></p> }

                {message.buffer && message.contentType === 'imageMessage' && (
                    <>
                        <GalleryImage src={`data:image/jpeg;base64,${message.buffer}`} alt="Message Image" />
                        <p>{message.content}</p>
                    </>
                )}
                {message.buffer && message.contentType === 'audioMessage' && (
                    <ChatAudioPlayer msg={message} />
                )}
                {message.contentType == "text" && message.content !== 'undefined' && (
                    <p>{message.content}</p>
                )}
            </div>
        </div>
    );
})

export default ChatMessage;