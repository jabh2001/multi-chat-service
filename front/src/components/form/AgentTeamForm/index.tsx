import { useEffect, useState } from "react"
import TeamsCheckboxes from "../inputs/TeamsCheckboxes"
import { TeamType } from "../../../types"
import styles from "./index.module.css"
import { putAgentTeam } from "../../../service/api"
import AgentProtection from "../AgentProtection"

export default function AgentTeamForm({ agentId, name, teams, setTeams }:{ agentId:any, name:string, teams:TeamType[], setTeams:any }){
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    useEffect(()=> {
        setSelectedIds(teams.map(l =>  l.id))
    }, [teams])

    const handleSubmit:React.FormEventHandler<HTMLFormElement> = async e => {
        e.preventDefault()
        const teams = await putAgentTeam(agentId, selectedIds)
        setTeams(teams)
    }

    return <form className={styles.form} onSubmit={handleSubmit}>
        <AgentProtection>
            <h3 className={styles.title}> Etiquetas de {name}</h3>
            <div className={styles.teams}>
                <TeamsCheckboxes selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
            </div>
            <div className={styles.button}>
                <button className="btn primary">guardar</button>
            </div>
        </AgentProtection>
    </form>
}