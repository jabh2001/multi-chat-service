import { Control, Controller } from "react-hook-form";
import styles from "./index.module.css"
import { useState } from "react";

type Props = {
    rows?:number
    label?:string
    name:string
    control: Control<any, any, any>
    resizable?:boolean
}

export default function Textarea({ label, name, control, rows=4, resizable }:Props){
    const [ focus, setFocus ] = useState(false)

    return (
        <Controller 
            control={control}
            name={name}
            render={({ field, fieldState:{ error } }) =>{
                const { onBlur, value } = field
                return (
                    <div className={`${styles.inputGroup} ${error && styles.error} ${resizable && styles.resizable}`}>
                        <textarea 
                            {...field}
                            value={value ?? ""}
                            className={`${styles.input} ${(focus || value) && styles.focus}`} 
                            onFocus={()=>setFocus(true)} 
                            onBlur={()=>{ onBlur();setFocus(false); }}
                            rows={rows}
                        />
                        { label && <label className={styles.label}>{label}</label>}
                        { error && <p className={styles.errorMessage}>{error.message}</p> }
                    </div>
                )
            }}
        />
    )
}