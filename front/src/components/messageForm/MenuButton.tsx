import { useRef, useState } from "react"
import CameraIcon from "../icons/CameraIcon"
import useClickOutside from "../../hooks/useClickOutside"
import useMessageMedia from "../../hooks/useMessageMedia"
import { Modal, ModalAction, ModalBody, ModalFooter, ModalHeader } from "../Modal"
import { useFastMessage } from "../../hooks/useFastMessage"
import { FastMessageType } from "../../libs/schemas"
import { useDebounce } from "../../hooks/useDebounce"
import styles from "./menuButton.module.css"
import useAudioRecorder from "../../hooks/useAudioRecorder"
import MicrophoneIcon from "../icons/MicrophoneIcon"
import useCamera from "../../hooks/useCamera"
import PaperclipIcon from "../icons/PaperclipIcon"
import FileIcon from "../icons/FileIcon"
import LightingIcon from "../icons/LightingIcon"

export default function MenuButton({ onSelectMessage }:{ onSelectMessage:(fastMessage:FastMessageType) => void}){
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    useClickOutside(ref, () => setOpen(false))
    return (
        <div ref={ref} className={styles.container}>
            <div className={`${styles.menuContainer} ${open && styles.visible}`}>
                <div className={styles.menu}>
                    <MenuFileInputOption 
                        icon={<FileIcon stroke="#fff" fill="transparent"/>} 
                        title="Imágenes, audios y videos"
                        accept="image/png, image/jpeg, audio/mp3, audio/ogg, audio/opus, video/mp4"
                        onAppendFile={() => setOpen(false)}
                    />
                    <MenuFastMessageInputOption onSelectMessage={onSelectMessage} />
                    {/* <MicrophoneButton />     */}
                    <CameraButton />                    
                </div>
            </div>
            <button type="button" className={styles.button} onClick={() => setOpen(open => !open)}>
                <PaperclipIcon />
            </button>
        </div>
    )
}

function MenuFileInputOption({ title, icon, accept, onAppendFile }:{ title:string, icon:JSX.Element, accept?:string, onAppendFile?:(fileList:FileList) => void }){
    const appendFile = useMessageMedia(state => state.appendFile)
    return (
        <label className={styles.option}>
            <input type="file" className={styles.fileInput} accept={accept} onChange={e => {
                if(!e.target.files){
                    return null
                }
                for(const f of e.target.files){
                    appendFile(f)
                }
                onAppendFile && onAppendFile(e.target.files)
            }} multiple />
            <span className={styles.optionIcon}>{icon}</span>
            <span className={styles.optionTitle}>{title}</span>
        </label>
    )
}
function MenuFastMessageInputOption({ onSelectMessage }:{ onSelectMessage:(fastMessage:FastMessageType) => void}){
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const { fastMessages } = useFastMessage()
    const debounceSearch = useDebounce(search, 500)
    const filteredFastMessages = fastMessages.filter(fastMessage => {
        return debounceSearch === "" || (
            fastMessage.title.toLowerCase().includes(debounceSearch.toLowerCase()) || 
            fastMessage.keyWords.toLowerCase().includes(debounceSearch.toLowerCase())
        )
    })
    const handleClick = (fastMessage:FastMessageType) => {
        onSelectMessage(fastMessage)
        setOpen(false)
        console.log("open")
    }
    
    return (
        <>
            <button type="button" className={styles.option} onClick={() => setOpen(true)}>
                <span className={styles.optionIcon}><LightingIcon /></span>
                <span className={styles.optionTitle}>Mensajes rápidos</span>
            </button>
            <Modal handleClose={() => setOpen(false)} open={open} size="fullWidth">
                <ModalHeader title="Mensajes rápidos" />
                <ModalBody>
                    <div className={styles.fastMessagesOptionsContainer}>
                        {
                            
                            filteredFastMessages.map(f => (
                                <button type="button" key={`fastMessageModalButton-${f.id}`} className={styles.fastMessagesOptionsButton} onClick={() => handleClick(f)}>
                                    <span>{f.title}</span>
                                    <span>{f.keyWords}</span>
                                </button>
                            ) )
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <label className={styles.searchFastMessage}>
                        Buscar mensajes rápidos
                        <input type="text" onChange={evt => setSearch(evt.target.value)}/>
                    </label>
                </ModalFooter>
            </Modal>
        </>
    )
}
export const MicrophoneButton = () => {
    const { isRecording, getFile, start, stop} = useAudioRecorder()
    const appendFile = useMessageMedia(state => state.appendFile)
    const handleClick = () => {
        if(isRecording){
            stop()
            appendFile(getFile())
        } else {
            start()
        }
    }
    return (
        <button type="button" className={`${styles.option} ${isRecording && styles.recording} `} onClick={handleClick}>
            <span className={styles.optionIcon}><MicrophoneIcon /></span>
            <span className={styles.optionTitle}>Micrófono</span>
        </button>
    )
}

const CameraButton = () => {
    const ref = useRef<HTMLVideoElement>(document.createElement("video"))
    const appendFile = useMessageMedia(state => state.appendFile)
    const { start, stop, shot, getFile } = useCamera({ target:ref.current})
    const [open, setOpen] = useState(false)
    const handleClick = () => {
        start()
        setOpen(!open)
    }
    const handleClose = () => {
        setOpen(false)
        stop()
    }
    const handleShot = () => {
        shot()
        appendFile(getFile())
        stop()
    }

    return (
        <>
            <Modal size="xl" open={open} handleClose={handleClose}>
                <ModalHeader title={"ScreenShot"} />
                <ModalBody>
                    <video className={styles.camContainer} ref={ref}></video>
                </ModalBody>
                <ModalFooter>
                    <ModalAction title="Tomar" onClick={handleShot} />
                </ModalFooter>
            </Modal>
            <button type="button" className={`${styles.option} ${open && styles.recording} `} onClick={handleClick}>
                <span className={styles.optionIcon}><CameraIcon /></span>
                <span className={styles.optionTitle}>Cámara</span>
            </button>
        </>
    )
}