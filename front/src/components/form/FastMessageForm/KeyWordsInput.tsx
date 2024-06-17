import { useEffect, useState } from "react"
import { Control, Controller } from "react-hook-form"

export default function KeyWordsInput({ name, control}:{name:string, control:Control<any, any, any>}){
    // const [keyWordsCount, setKeyWordsCount] = useState(1)
    return (
        <Controller 
            name={`${name}`}
            control={control} 
            render={({ field }) => {
                const {onChange, value} = field
                const [keys, setKeys] = useState<string[]>([""]) // para que el primer input no

                useEffect(() => {
                    if(typeof value === "string" && value !== "" && value !== keys.join(",")){
                        setKeys([...value.split(","), ""])
                    }
                }, [value])

                return (
                    <>
                        {
                            keys.map((v, i) => (
                                <input
                                    key={`key-words-input-${name}-${i}`}
                                    type="text" 
                                    className={"block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"}
                                    placeholder="palabra clave"
                                    value={v}
                                    onChange={evt => {
                                        if(i === keys.length - 1 && evt.target.value !== ""){
                                            const newKeys = [...keys.map((k, j)=> j===i ? evt.target.value : k), ""]
                                            setKeys([...keys.map((k, j)=> j===i ? evt.target.value : k), ""])
                                            onChange(newKeys.slice(0, -1).join(","))
                                        } else if(keys.length > 1 && i === keys.length - 2  && evt.target.value === "" && keys[keys.length - 1] === "") {
                                            const newKeys = keys.filter((_, j) => j !== keys.length - 1).map((k, j)=> j===i ? evt.target.value : k)
                                            setKeys(keys.filter((_, j) => j !== keys.length - 1).map((k, j)=> j===i ? evt.target.value : k))
                                            onChange(newKeys.slice(0, -1).join(","))
                                        } else {
                                            const newKeys = keys.map((k, j)=> j===i ? evt.target.value : k)
                                            setKeys(newKeys)
                                            onChange(newKeys.slice(0, -1).join(","))
                                        }
                                    }}
                                />
                            ))
                        }
                    </>
                )
            }}
        />
    )
}