import ReactDom  from 'react-dom';
import styles from "./modal.module.css"
import { useEffect, useMemo, useState } from 'react';

type Props = {
    open?:boolean
    handleClose?:()=>void
    size?:"xs" | "sm" | "md" | "lg" | "xl" | "fullWidth"
    children?:React.ReactNode
}

function Modal({ open=false, handleClose=()=>{}, children, size="sm"}:Props){
    const styleSize = useMemo(()=>(
        size == "xs" ? styles.xs :
        size == "sm" ? styles.sm :
        size == "md" ? styles.md :
        size == "lg" ? styles.lg :
        size == "xl" ? styles.xl :
        size == "fullWidth" ? styles.fullWidth : ""
    ), [size])
    const [ isFirstRender, setIsFirstRender ] = useState(!open)

    useEffect(()=>{isFirstRender && open && setIsFirstRender(false);}, [open])

    return (
        <div className={`${styles.modalBg} ${open ? styles.show : styles.hidden} ${ isFirstRender && styles.isFirstRender }`}>
            <div className={`${styles.modal} ${styleSize}`}>
                <button onClick={handleClose} className={styles.close}>X</button>
                {children}
            </div>
        </div>
    )
}
export default function Main(props:Props){
    return ReactDom.createPortal(<Modal {...props} />, document.getElementById("modal") as HTMLElement)
}
export { 
    Main as Modal
}
