import { useEffect, useState } from "react"
import ImageIcon from "../icons/ImageIcon"
import MicrophoneIcon from "../icons/MicrophoneIcon"
import VideoIcon from "../icons/VideoIcon"
import styles from "./mediaItem.module.css"
import useMessageMedia from "../../hooks/useMessageMedia"

const videoType = /video.*/
const imageType = /image.*/
const audioType = /audio.*/

export default function MediaItem({ item }:{ item:File}){
    const [data, setData] = useState("")
    const deleteFile = useMessageMedia(state => state.deleteFile)
    
    useEffect(() => {
        if(item instanceof File && (item.type.match(imageType) || item.type.match(audioType))){
            const reader = new FileReader()
            reader.onload = (evt) => {
                if(evt.target?.result && typeof evt.target.result === "string"){
                    setData(evt.target.result)
                }
            }
            reader.readAsDataURL(item)
        }
    }, [item])
    return (
        <div className={styles.mediaItemContainer}>
            {
                data !== "" && item.type.match(imageType) && <img src={data}  alt="preview"/> 
            }
            { item.type.match(videoType) && <VideoIcon /> }
            { item.type.match(imageType) && <ImageIcon /> }
            { item.type.match(audioType) && <MicrophoneIcon />}
            { item && <span className={styles.mediaItemCloseButton} onClick={() => deleteFile(item)}>x</span>}
        </div>
    )
}