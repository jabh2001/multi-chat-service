import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import "./audio.css"
import { create } from 'zustand';
import { useEffect, useRef } from 'react';

const useAudioPlayer = create<{ src:string, setSrc:(src:string) => void}>(set => ({
    src:"",
    setSrc:(src:string) => set({ src }) 
}))

export default function AudioMessage({ src }:{ src:string }){
    const ref = useRef<AudioPlayer>(null)
    const playingSrc = useAudioPlayer(store => store.src)
    const setSrc = useAudioPlayer(store => store.setSrc)

    useEffect(() => {
        if(src !== playingSrc){
            ref.current?.audio.current?.pause()
        }
    }, [src, playingSrc])
    
    return (
        <AudioPlayer 
            ref={ref}
            src={src}
            className='w-64 md:w-96 bg-transparent border-none text-red-200'
            layout='horizontal-reverse'
            showSkipControls={false}
            showJumpControls={false}
            customAdditionalControls={[]}
            defaultCurrentTime=""
            defaultDuration=""
            customProgressBarSection={[ RHAP_UI.PROGRESS_BAR ]}
            customControlsSection={[ RHAP_UI.MAIN_CONTROLS]}
            customVolumeControls={[]}
            onPlay={() => {
                setSrc(src)
            }}
        />
    )
}