import styles from './index.module.css';

type Props = {
    agent:any
}
export default function AgentCard({ agent }:Props){
    return (
        <div key={agent.id} className={`${styles.agent} ${agent.type == "admin" ? styles.admin : ""}`}>
            <div className={styles.name}>{agent.name}</div>
            <div className={styles.email}>{agent.email}</div>
            <div className={styles.type}>{agent.type}</div>
        </div>
    )
}