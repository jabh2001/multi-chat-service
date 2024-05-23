import { useRef, useState } from "react"
import CameraIcon from "../icons/CameraIcon"
import XMarkIcon from "../icons/XMarkIcon"
import useClickOutside from "../../hooks/useClickOutside"
import useMessageMedia from "../../hooks/useMessageMedia"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal"
import { useFastMessage } from "../../hooks/useFastMessage"
import { FastMessageType } from "../../libs/schemas"
import { useDebounce } from "../../hooks/useDebounce"
import styles from "./menuButton.module.css"

export default function MenuButton({ onSelectMessage }:{ onSelectMessage:(fastMessage:FastMessageType) => void}){
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    useClickOutside(ref, () => setOpen(false))
    return (
        <div ref={ref} className={styles.container}>
            <div className={`${styles.menuContainer} ${open && styles.visible}`}>
                <div className={styles.menu}>
                    <MenuFileInputOption 
                        icon={<CameraIcon/>} 
                        title="Imágenes, audios y videos"
                        accept="image/png, image/jpeg, audio/mp3, audio/ogg, audio/opus, video/mp4"
                        onAppendFile={() => setOpen(false)}
                    />
                    <MenuFastMessageInputOption onSelectMessage={onSelectMessage} />
                </div>
            </div>
            <button type="button" className={styles.button} onClick={() => setOpen(open => !open)}>
                <XMarkIcon />
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
                <span className={styles.optionIcon}>🔥</span>
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