import useAuth from "../../../hooks/useAuth";
import styles from "./index.module.css"

export default function AgentProtection({ children }:any){
    const user = useAuth(store => store.user)
    if(user?.role == "admin"){
        return children
    }
    return (
        <div className={styles.protectionContainer}>
            <p className={styles.protectionText}>AGENT PROTECTION</p>
        </div>
    )
}