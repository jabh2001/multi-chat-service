import styles from "./index.module.css"

export default function Separated({ text }:{ text?:string}){
    return (
        <span className={styles.separated}>
            {text}
        </span>
    )
}