import React from 'react';
import styles from './ChatVideoPlayer.module.css'; // Crea un archivo CSS si necesitas estilos

interface ChatVideoPlayerProps {
    src: string;
}

const ChatVideoPlayer: React.FC<ChatVideoPlayerProps> = ({ src }) => {
    return (
        <div className={styles.videoContainer}>
            <video className={styles.videoPlayer} controls>
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default ChatVideoPlayer;
