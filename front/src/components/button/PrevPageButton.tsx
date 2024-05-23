import { useNavigate } from "react-router-dom";
import ArrowIcon from "../icons/ArrowIcon";
import styles from "./index.module.css"

export default function PrevPageButton({ prevPage, title }:{ title:string, prevPage?:string | undefined}){
    const navigate = useNavigate()
    return (
        <div className={styles.prevPageButton} onClick={() => navigate(prevPage ? prevPage as any : -1 )}>
            <button> <ArrowIcon /> </button>
            <h2>{title}</h2>
        </div>
    )
}