
import styles from "./modal.module.css"

export function ModalBody({ children }:{ children?:React.ReactNode}){
    return (
        <div className={styles.body}>
            {children}
        </div>
    )
}