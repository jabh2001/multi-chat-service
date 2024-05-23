import { useEffect, useRef, useState } from 'react';
import styles  from './index.module.css';
import { flushSync } from 'react-dom';
import { generateString, toHHMMSS } from '../../service/general';
type Props = {
    src:HTMLAudioElement | string
    onPlay?:(audio:HTMLAudioElement)=>void
    onPause?:(audio:HTMLAudioElement)=>void
    onChangeTime?:(audio:HTMLAudioElement)=>void
    onChangeVolume?:(audio:HTMLAudioElement)=>void
    volumeControl?:boolean
    transparent?:boolean
    dark?:boolean
}
export default function AudioPlayer({ src, volumeControl=true, transparent, dark, onPlay, onPause }:Props){
    const [audio, setAudio] = useState(new Audio())
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const ref = useRef(generateString(10))

    useEffect(()=>{
        if (typeof src === "string"){
            setAudio(new Audio(src))
        } else {
            setAudio(src)
        }
    }, [src] )

    const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
    }

    useEffect(()=>{
        audio.addEventListener('timeupdate', handleTimeUpdate)
        setDuration(isNaN(audio.duration) ? 0 : audio.duration)
        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
        }
    }, [audio])

    const handlePlayPause = ()=> {
        if(duration !== audio.duration){
            setDuration(isNaN(audio.duration) ? 0 : audio.duration)
        }
        if(isPlaying){
            onPlay && onPlay(audio)
            audio.pause()
        } else {
            onPause && onPause(audio)
            audio.play()
        }
        flushSync(()=>{
            document.startViewTransition(()=>{

                setIsPlaying(!audio.paused)
            })
        })
    }
    const handleMute = () => {

    }
    return (
        <div className={`${styles.audioContainer} ${transparent && styles.transparent} ${dark && styles.dark}`}>
            <button className={`${styles.playBtn} ${styles.btn}`} onClick={handlePlayPause}>
                { 
                    isPlaying ? 
                    <span style={{ viewTransitionName:`${duration}-video-player-${ref.current}`}}><PauseIcon /></span> :
                    <span style={{ viewTransitionName:`${duration}-video-player-${ref.current}`}}> <PlayIcon /></span>
                }
            </button>
            <div className={styles.timeControls}>
                <div className={styles.currentTime}>{ toHHMMSS(currentTime.toString())}</div>
                <input type="range" className={styles.slider} min={0} max={duration*1_000_000} value={currentTime*1_000_000} onChange={e => audio.currentTime = Number(e.target.value)}/>
                <div className={styles.totalTime}>{ toHHMMSS(duration.toString())}</div>
            </div>
            {
                volumeControl && (
                    <div className={styles.volumeControls}>
                        <button className={`${styles.volumeBtn} ${styles.btn}`} onClick={handleMute}>
                            <VolumeIcon />
                        </button>
                        <div className={styles.control}>
                            <input type="range" className={styles.slider} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}
/*

<div className="audio green-audio-player">
    <div className="play-pause-btn">
        <PlayIcon />
    </div>

    <div className="controls">
        <span className="current-time">0:00</span>
        <div data-direction="horizontal" className="slider">
            <div className="progress">
                <div data-method="rewind" id="progress-pin" className="pin"></div>
            </div>
        </div>
        <span className="total-time">0:00</span>
    </div>

    <div className="volume">
        <div className="volume-btn">
            <VolumenIcon />
        </div>
        <div className="volume-controls hidden">
        <div data-direction="vertical" className="slider">
            <div className="progress">
            <div data-method="changeVolume" id="volume-pin" className="pin"></div>
            </div>
        </div>
        </div>
    </div>
</div>
*/
// function PlayIcon(){
//     return (
//         <svg viewBox="0 0 18 24" height="24" width="18" xmlns="http://www.w3.org/2000/svg">
//             <path id="playPause" className="play-pause-icon" d="M18 12L0 24V0" fillRule="evenodd"></path>
//         </svg>
//     )
// }
export const PauseIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
)

export const PlayIcon = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
)
function VolumeIcon(){
    return (
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path id="speaker" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" fillRule="evenodd"></path>
        </svg>
    )
}