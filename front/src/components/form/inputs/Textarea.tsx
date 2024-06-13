import { Control, Controller } from "react-hook-form";
import useRandomId from "../../../hooks/useRandomId";

type Props = {
    rows?:number
    label?:string
    name:string
    control: Control<any, any, any>
    resizable?:boolean
}

export default function Textarea({ label, name, control, rows=4 }:Props){
    const [ id ] = useRandomId()

    return (
        <Controller 
            control={control}
            name={name}
            render={({ field }) =>{
                return (
                    <div>
                        <label htmlFor={id} className="mb-3 block text-black">
                            {label}
                        </label>
                        <textarea
                            {...field}
                            id={id}
                            rows={rows}
                            value={field.value ?? ""}
                            className="w-full rounded-lg border-[1.5px] border-slate-200 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-white "
                        ></textarea>
                    </div>
                )
            }}
        />
    )
}