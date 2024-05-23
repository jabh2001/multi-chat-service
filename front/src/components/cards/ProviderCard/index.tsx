import { Link } from "react-router-dom"
import styles from "./index.module.css"
type Props = {
    title:string
    src:string
    to:string
}

export default function ProviderCard({ title, src, to }:Props){
    return (
        <Link className={styles.card} to={to}>
            <img className={styles.img} src={src} alt={title} />
            <div className={styles.title}>{ title}</div>
        </Link>
    )
}