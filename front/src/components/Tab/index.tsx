import { createContext, useContext, useEffect, useState } from "react"
import style from "./index.module.css"
import { generateString } from "../../service/general"

const context = createContext<{ value:any, setValue:(value:any)=>void, tabName:string}>({ value:0, setValue:(_:any) => {}, tabName:""})

function Tabs({ children, value, setValue }:{ children:any, value?:any, setValue?:(value:any)=>void}){
    const [ tabName ] = useState(generateString(10))
    const [ intValue, setIntValue ] = useState<any>(value ?? 0)
    useEffect(()=> {
        setIntValue(value)
    }, [value])
    return (
        <context.Provider value={{ value:intValue, setValue:(value) => setValue ? setValue(value) : setIntValue(value), tabName}}>
            <div className={style.radioInputs} aria-label={`tabs-${tabName}`}>
                {children}
            </div>
        </context.Provider>
    )
}

function Tab({ value, name, notifications=0 }:{ value:any, name:string, notifications?:number }){
    const { value:selectedValue, setValue, tabName} = useContext(context)
    return (
        <label className={style.radio}>
            <input type="radio" name={tabName} checked={selectedValue === value} onChange={e => setValue((v:any) => e.target.checked ? value : v)} style={ value === selectedValue ? { viewTransitionName:tabName + "Selected"}:{}}/>
            <span className={style.name}>
                {name}
                { !!notifications && <span className={style.notifications}>{notifications}</span> }
            </span>
        </label>
    )
}
export {
    Tabs,
    Tab
}