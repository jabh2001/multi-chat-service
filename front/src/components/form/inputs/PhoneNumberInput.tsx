import { Control, Controller, useForm } from "react-hook-form"
import countries from "../../../countries.json"
import Select from "./Select"
import NormalInput from "./NormalInput"
import Option from "./Option"
import styles from "./index.module.css"
import { useEffect } from "react"

type Props = {
    label:string
    name:string
    control: Control<any, any, any>
}
export default function PhoneNumberInput({label, name, control}:Props){
    
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {

                const { onChange } = field
                const { control, watch } = useForm<{code:string, number:number}>()

                useEffect(() => {
                  const subscription = watch(({ code, number }) =>
                    onChange(`${code}${number}`)
                  )
                  return () => subscription.unsubscribe()
                }, [watch])

                return (
                    <label className={styles.phoneNumber}>
                        <Select control={control}  label="Cod"name="code" search>
                                {
                                    countries.map(({ code, name, dial_code}) =>(
                                        <Option
                                            img={(_l, _v, code) => `https://flagsapi.com/${code}/flat/16.png`}
                                            label={dial_code}
                                            key={`hone_number_${name}_${dial_code}`} 
                                            value={dial_code}
                                            extraParam={code}
                                        />
                                    ))
                                }
                        </Select>
                        <NormalInput control={control} name="number" label={label} />
                    </label>
                )
            }}
        />
    )
}

// const regex = /^\+[1-9]{1}[0-9]{3,14}$/