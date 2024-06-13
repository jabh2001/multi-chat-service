import { Control, Controller } from "react-hook-form"
import { useRef } from "react"

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
                    <div className="flex flex-col">
                        <label className="mb-3 block text-black">
                            {label}
                        </label>
                        <input
                            {...field}
                            ref={input => {
                                ref(input)
                                inputRef.current = input
                            }}
                            accept={accept}
                            type="file"
                            onChange={evt => onChange(evt.target.files ? evt.target.files[0] : undefined)}
                            className={`
                                block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none
                                file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-white file:py-3 file:px-5 file:hover:bg-blue-500 file:hover:bg-opacity-50
                            `}
                        />
                    </div>
                )
            }}
        />
    )
}
