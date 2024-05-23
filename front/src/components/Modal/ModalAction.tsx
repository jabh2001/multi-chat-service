import styles from "./modal.module.css"

type AProps = {
    title?:string
    onClick?:()=>void
}
export function ModalAction({ title, onClick }:AProps){
    return <button onClick={onClick} className={styles.action}>{title}</button>
}