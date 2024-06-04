import React, { useRef } from 'react';
import styles from './ChatVideoPlayer.module.css';

interface ChatVideoPlayerProps {
    src: string;
}

const ChatVideoPlayer: React.FC<ChatVideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFullScreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            } else if (videoRef.current.mozRequestFullScreen) {
                videoRef.current.mozRequestFullScreen();
            } else if (videoRef.current.webkitRequestFullscreen) {
                videoRef.current.webkitRequestFullscreen();
            } else if (videoRef.current.msRequestFullscreen) {
                videoRef.current.msRequestFullscreen();
            }
        }
    };

    return (
        <div className={styles.videoContainer}>
            <video
                ref={videoRef}
                className={styles.videoPlayer}
                controls
                onPlay={handleFullScreen}
            >
                <source src={src} type="video/mp4" />
            </video>
        </div>
    );
}

export default ChatVideoPlayer;
