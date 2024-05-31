import React from 'react';
import styles from './ChatVideoPlayer.module.css';

interface ChatVideoPlayerProps {
    src: string;
}

const ChatVideoPlayer: React.FC<ChatVideoPlayerProps> = ({ src }) => {
    return (
        <div className={styles.videoContainer}>
            <video className={styles.videoPlayer} controls>
                <source src={src} type="video/mp4" />
            </video>
        </div>
    );
}

export default ChatVideoPlayer;
