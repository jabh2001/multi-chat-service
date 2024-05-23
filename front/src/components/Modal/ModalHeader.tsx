import { useMemo } from "react";
import styles from "./modal.module.css"

type HProps = {
    title:string|JSX.Element;
    align?:"center" | "start" | "end"
}
export function ModalHeader({ title, align="start" }:HProps){
    const style = useMemo(()=>(
        align === "center" ? styles.center : 
        align === "start" ? styles.start : 
        align === "end" ? styles.end : ""
    ), [align])

    return (
        <div className={`${styles.header} ${style}`}>
            <h3>{title}</h3>
        </div>
    )
}