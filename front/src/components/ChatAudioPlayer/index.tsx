import { useRef } from "react";
import { MessageType } from "../../types";
import AudioPlayer from "../AudioPlayer";

type Props = {
    msg:MessageType
}
export default function ChatAudioPlayer({ msg }:Props){
    const audio = useRef(new Audio(`data:audio/ogg;base64,${msg.buffer}`))
    
    return (
        <AudioPlayer src={audio.current} volumeControl={false} transparent dark />
    )
}
