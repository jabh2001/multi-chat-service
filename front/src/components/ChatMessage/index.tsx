import { forwardRef } from "react";
import styles from './index.module.css'
import { MessageType } from "../../types";
import GalleryImage from "../GalleryImage/GalleryImage";
import ChatAudioPlayer from "../ChatAudioPlayer";
import ChatVideoPlayer from "../VideoPlayer/VidePlayer";
import ChatDocumentMessage from "../ChatDocumentMessage";

interface ChatMessageProps {
    message: MessageType
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ message }: ChatMessageProps, ref) => {
    return (
        <div className={styles.container} ref={ref} id={`message-${message.id}`}>
            <div className={`${styles.message} ${message.messageType === "incoming" ? styles.incoming : styles.outgoing} ${!message.private && styles.whatsapp}`}>
                { message.user?.name && <p className={styles.messageUsername}><span className={styles.whiteText}>{`${message.user.email} - ${message.user.name}`}</span></p> }

                {message.buffer && message.contentType === 'imageMessage' && (
                    <>
                        <GalleryImage src={`data:image/jpeg;base64,${message.buffer}`} alt="Message Image" />
                        <p className={styles.whiteText}>{message.content}</p>
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