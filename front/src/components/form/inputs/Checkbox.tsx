import { Control, Controller } from "react-hook-form"
import styles from "./index.module.css"

type Props = {
    label:string
    name:string
    control: Control<any, any, any>
}

export default function Checkbox ({ label,name,control}:Props) {

    return (
        <Controller 
            control={control}
            name={name}
            render={ controller => {
                return (
                    <label className={styles.checkbox}>
                        <span>{label}</span>
                        <input
                            type="checkbox"
                            {...controller.field}
                            // checked={checked}
                            // onChange={() => setSelectedIds(
                            //     checked ? selectedIds.filter(id => id !== label.id) : [...selectedIds, label.id]
                            // )}
                        />
                    </label>
                )
            }}
        />
    )
} 