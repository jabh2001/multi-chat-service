import { Control, Controller } from "react-hook-form"
import CaretIcon from "../../icons/CaretIcon"

type Props = {
    label: string
    name: string
    control: Control<any, any, any>
    search?: boolean
    children?: React.ReactNode
    transparent?: boolean
    dark?: boolean
}


export default function Select({ label, name, control, children }: Props) {

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                return (
                    <div className="flex flex-col">
                      <label className="mb-2 block text-black">
                        {label}
                      </label>
                      <div className="relative z-20 bg-transparent">
                        <select 
                            {...field}
                            className={`relative z-20 w-full appearance-none rounded border border-slate-200 bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary ${field.value ? 'text-black' : ''}`}
                        >
                            {children}
                        </select>
                
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                            <CaretIcon />
                        </span>
                      </div>
                    </div>
                )
            }}
        />
    )
}