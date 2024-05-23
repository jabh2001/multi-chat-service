import { useLabel } from "../../../hooks/useLabelStore"
import styles from "./index.module.css"

type Props = {
    selectedIds : number[]
    setSelectedIds : React.Dispatch<React.SetStateAction<number[]>>
}
export default function LabelsCheckboxes({ selectedIds, setSelectedIds }:Props){
    const { labels } = useLabel()

    return (
        <>
            {
                labels.map((label) => {
                    const checked = selectedIds.includes(label.id)
                    return (
                        <label key={`label_${label.id}_${label.name}`} className={styles.checkbox}>
                            <span>{label.name}</span>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => setSelectedIds(
                                    checked ? selectedIds.filter(id => id !== label.id) : [...selectedIds, label.id]
                                )}
                            />
                        </label>
                )})
            }
        </>
    )
}