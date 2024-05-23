import { useEffect, useRef, useState } from "react"
import styles from "./GalleryImage.module.css"
import ReactDOM, { flushSync } from "react-dom"
import { generateString } from "../../service/general"

type Props = {
    src?: string
    alt?:string
    className?:string
}

const container = document.getElementById("bigImage") as HTMLElement
export default function GalleryImage({ className, ...rest}:Props){
    const [ open, setOpen ] = useState(false)
    const ref = useRef(generateString(10))

    const toggle = () => {
            if(document.startViewTransition) {
                document.startViewTransition(()=>{
                    flushSync(()=>{
                        setOpen(value => !value)
                    })
                })
            } else {

                setOpen(value => !value)
            }
    }
    useEffect(()=>{
        if(open){
            const onEscClose:(evt:KeyboardEvent) => void = e =>{
                if (e.code === 'Escape'){
                    toggle()
                }
            }
            document.body.addEventListener( "keydown", onEscClose)
            return () =>{ document.body.removeEventListener("keydown", onEscClose)}
        }
    }, [open])

    return (
        <>
            <div className={`${styles.container} ${className}`} onClick={toggle}>
            <img className={styles.img + " " + styles.anim} {...rest} style={!open ? { viewTransitionName: ref.current}:{}} />
            </div>
            { 
            ReactDOM.createPortal((
                open && <div className={styles.modalBg} >
                    <div className={styles.modal}>
                        <button className={styles.modalClose} onClick={toggle}>x</button>
                        <div className={styles.modalImgContainer}>
                            <img className={styles.modalImg + " " + styles.anim} {...rest} style={{ viewTransitionName: ref.current}} /> 
                        </div>
                    </div>
                </div>
            ), container)}
        </>
    )
}