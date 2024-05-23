import ReactDom from "react-dom"
import styles from "./snackbar.module.css"
import { useEffect, useMemo, useState } from "react"

type Props = {
    children?: React.ReactNode
    color?:Color
    open:boolean, handleClose:()=>void
    hiddenTimeout?:number 
}
type Color = "primary" | "secondary" | "error" | "warning" | "info" | "success"
const  colors: Record<Color, string> = {
    primary:styles.primary,
    secondary:styles.secondary,
    error:styles.error,
    warning:styles.warning,
    info:styles.info,
    success:styles.success,
}
const container = document.getElementById("snackbar") as HTMLElement
const steps = 250

export default function Snackbar({ children, open, handleClose:close, hiddenTimeout=5000, color="primary" }:Props){
    const [render, setRender ] = useState(false)
    const stepLength = useMemo(()=> hiddenTimeout / steps, [hiddenTimeout])
    const [ currentProgress, setCurrentProgress ] = useState(hiddenTimeout)
    const handleClose = ()=>{
        close()
        setTimeout(()=>{
            setRender(false)
        }, 250)
    }
    useEffect(()=> {
        if(open){
            setRender(open)
            setCurrentProgress(0)
            const  timerId = setInterval(() => setCurrentProgress(value => value+stepLength), stepLength)

            const i = setTimeout(()=>{
                setTimeout(()=>{
                    clearInterval(timerId)
                    handleClose()
                }, 200)
            }, hiddenTimeout)

            return ()=> { 
                clearTimeout(i)
                clearInterval(timerId)
            }
        }
    }, [open])
    
    return render && ReactDom.createPortal((
        <div className={`${styles.snackbar} ${open && styles.show} ${colors[color]}`} style={{ ["--length" as any]: `${(currentProgress / hiddenTimeout) * 100   }%`}}>
            <div className={styles.text}>
                <p>{children}</p>
            </div>
            <button className={styles.closeButton} onClick={handleClose}>x</button>
            <div className={styles.progress}>
                <div></div>
            </div>
        </div>
    ), container)
}