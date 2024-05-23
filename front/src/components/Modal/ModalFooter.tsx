import { useMemo } from "react";
import styles from "./modal.module.css"

type FProps = {
    align?:"center" | "start" | "end"
    children?:React.ReactNode
}
export function ModalFooter({ children, align="end" }:FProps){
    const style = useMemo(()=>(
        align === "center" ? styles.center : 
        align === "start" ? styles.start : 
        align === "end" ? styles.end : ""
    ), [align])

    return (
        <div className={`${styles.footer} ${style}`}>
            { children }
        </div>
    )
}