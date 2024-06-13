import { Control, Controller, useForm } from "react-hook-form"
import countries from "../../../countries.json"
import { useEffect } from "react"
import useRandomId from "../../../hooks/useRandomId"

type Props = {
    label:string
    name:string
    control: Control<any, any, any>
}
// export default function PhoneNumberInput({label, name, control}:Props){
    
//     return (
//         <Controller
//             control={control}
//             name={name}
//             render={({ field }) => {

//                 const { onChange } = field
//                 const { control, watch } = useForm<{code:string, number:number}>()

//                 useEffect(() => {
//                   const subscription = watch(({ code, number }) =>
//                     onChange(`${code}${number}`)
//                   )
//                   return () => subscription.unsubscribe()
//                 }, [watch])

//                 return (
//                     <label className={styles.phoneNumber}>
//                         <Select control={control}  label="Cod"name="code" search>
//                                 {
//                                     countries.map(({ code, name, dial_code}) =>(
//                                         <Option
//                                             img={(_l, _v, code) => `https://flagsapi.com/${code}/flat/16.png`}
//                                             label={dial_code}
//                                             key={`hone_number_${name}_${dial_code}`} 
//                                             value={dial_code}
//                                             extraParam={code}
//                                         />
//                                     ))
//                                 }
//                         </Select>
//                         <NormalInput control={control} name="number" label={label} />
//                     </label>
//                 )
//             }}
//         />
//     )
// }
export default function PhoneNumberInput({label, name, control}:Props){
    const [id] = useRandomId()
    
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {

                const { onChange } = field
                const { register, watch } = useForm<{code:string, number:number}>()

                useEffect(() => {
                  const subscription = watch(({ code, number }) =>
                    onChange(`${code}${number}`)
                  )
                  return () => subscription.unsubscribe()
                }, [watch])

                return (
                    <div className="flex flex-col">
                        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                            {label}
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor={id} className="sr-only">
                                    Country
                                </label>
                                <select
                                    {...register("code")}
                                    id={id}
                                    className="h-full rounded-md border-0 bg-transparent py-0 pl-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                >
                                    {
                                        countries.map(({ code, name, dial_code}) =>(
                                            <option key={`hone_number_${name}_${dial_code}`} value={dial_code}> {code} {dial_code}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <input
                                {...register("number")}
                                id={id}
                                className="block w-full rounded-md border-0 py-1.5 pl-28 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                )
            }}
        />
    )
}
// const regex = /^\+[1-9]{1}[0-9]{3,14}$/