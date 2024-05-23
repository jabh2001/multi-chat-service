import { createPortal} from "react-dom"
import styles from "./index.module.css"

type Props = {
    children:React.ReactNode
    open?:boolean
    onClose?:()=>void
}

const drawerContent = document.getElementById("multiChatDrawerContent")

export default function Drawer({ children, open, onClose }:Props){
    return <>
        {
            open && createPortal((
                <div className={`${styles.container} ${open ? styles.open : ""}`}>
                    <button className={styles.closeButton} onClick={onClose}>X</button>
                    <div className={styles.child}>
                        {children}
                    </div>
                </div>
            ), drawerContent as HTMLElement)
        }
    </>
}