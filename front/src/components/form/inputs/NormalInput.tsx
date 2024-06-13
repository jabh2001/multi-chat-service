import { Control, Controller } from "react-hook-form"
import { HTMLInputTypeAttribute, useRef } from "react"
import { generateString } from "../../../service/general"

type Props = {
    fullWidth?:boolean
    type?:HTMLInputTypeAttribute
    label?:string
    name:string
    control: Control<any, any, any>
}

export default function NormalInput({ type="text", label="", name, control }:Props){
    const id = useRef(generateString(16)).current

    return (
        <Controller 
            control={control}
            name={name}
            render={({ field, fieldState:{ error } }) =>{
                const { value } = field
                return (
                    <div className="flex flex-col">
                        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                            {label}
                        </label>
                        <div className="mt-2">
                            <input
                                {...field}
                                id={id}
                                value={value ?? ""}
                                type={type} 
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                            { error && <p className="text-red-500 transform -translate-y-2">{error.message}</p> }
                        </div>
                    </div>
                )
            }}
        />
    )
}