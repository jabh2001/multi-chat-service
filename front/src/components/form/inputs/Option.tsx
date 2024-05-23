import styles from "./index.module.css"
import { useMultiSelect } from "../../../hooks/useMultiSelect"
import { useRef } from "react"

type StringCallback = (label:string, value:any, extraParam:any) => string
type Props = {
    label:string
    value:any
    img?:string | StringCallback
    extraParam?:any
}
export default function Option({ label, value, img, extraParam }:Props){
    const { value:pValue, setValue, name, searchFilterFunction, resetFilters} = useMultiSelect()
    const optionRef = useRef<HTMLLabelElement>(null)
    
    if(searchFilterFunction && !searchFilterFunction(label)){
        return null
    }
    
    return (
        <label className={`${styles.option}`} ref={optionRef}>
            {
                img && (
                    <img 
                        src={typeof img === "string" ? img : img(label, value, extraParam)} 
                        alt="label"
                        className={styles.optionImg} 
                        loading="lazy"
                    />
                )
            }
            <input 
                type="radio" 
                value={value} 
                checked={value == pValue}
                onChange={(evt)=>{
                    const { checked, value } = evt.target
                    if(checked) {
                        setValue({value, label})
                        resetFilters && resetFilters()
                    }
                }}
                name={name}
            />
            <span>{label}</span>
        </label>
    )
}