type StringCallback = (label:string, value:any, extraParam:any) => string

type Props = {
    label:string
    value:any
    img?:string | StringCallback
    extraParam?:any
}

export default function Option({ label, value }:Props){
    return (
        <option value={value} className="text-gray-700">
            {label}
        </option>
    )
}