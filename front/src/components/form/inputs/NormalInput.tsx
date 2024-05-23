import { Control, Controller } from "react-hook-form"
import styles from "./index.module.css"
import { HTMLInputTypeAttribute, useState } from "react"

type Props = {
    fullWidth?:boolean
    type?:HTMLInputTypeAttribute
    label?:string
    name:string
    control: Control<any, any, any>
}

export default function NormalInput({ type="text", label="", name, control, fullWidth=false}:Props){
    const [ focus, setFocus ] = useState(false)
    
    return (
        <Controller 
            control={control}
            name={name}
            render={({ field, fieldState:{ error } }) =>{
                const { onBlur, value } = field
                return (
                    <div className={`${styles.inputGroup} ${error && styles.error} ${fullWidth && styles.fullWidth}`}>
                        <input 
                            {...field}
                            value={value ?? ""}
                            type={type} 
                            className={`${styles.input} ${(focus || value) && styles.focus}`} 
                            onFocus={()=>setFocus(true)} 
                            onBlur={()=>{ onBlur();setFocus(false); }}
                        />
                        { label && <label className={styles.label}>{label}</label>}
                        { error && <p className={styles.errorMessage}>{error.message}</p> }
                    </div>
                )
            }}
        />
    )
}