import { Control, Controller } from "react-hook-form"
import { useRef } from "react"
import ArrowIcon from "../../icons/ArrowIcon"
import styles from "./index.module.css"

type Props = {
    accept?:string
    label?:string
    name:string
    control: Control<any, any, any>
}

export default function FileInput({ label="", name, control, accept=""}:Props){
    
    return (
        <Controller 
            control={control}
            name={name}
            render={({ field:{ onChange, value, ref, ...field} }) =>{
                const inputRef = useRef<HTMLInputElement | null>()
                return (
                    <div className={styles.inputGroup}>
                        
                        <button type="button" className={`${styles.input} ${styles.button} ${value?.name && styles.file}`} onClick={()=>inputRef.current?.click()}>
                            <span>{value? value.name : label}</span>
                            <ArrowIcon  />
                        </button>
                        <input 
                            {...field}
                            ref={input => {
                                ref(input)
                                inputRef.current = input
                            }}
                            accept={accept}
                            type="file"
                            onChange={evt => onChange(evt.target.files ? evt.target.files[0] : undefined)}
                            className={`${styles.fileInput}`} 
                        />
                    </div>
                )
            }}
        />
    )
}

