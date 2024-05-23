import { useTeam } from "../../../hooks/useTeamStore"
import styles from "./index.module.css"

type Props = {
    selectedIds : number[]
    setSelectedIds : React.Dispatch<React.SetStateAction<number[]>>
}
export default function TeamsCheckboxes({ selectedIds, setSelectedIds }:Props){
    const { teams } = useTeam()

    return (
        <>
            {
                teams.map((team) => {
                    const checked = selectedIds.includes(team.id)
                    return (
                        <label className={styles.checkbox} key={`team_${team.id}_${team.name}`}>
                            <span>{team.name}</span>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => setSelectedIds(
                                    checked ? selectedIds.filter(id => id !== team.id) : [...selectedIds, team.id]
                                )}
                            />
                        </label>
                )})
            }
        </>
    )
}