import { useState } from "react";
import { generateString } from "../service/general";

export default function useRandomId(length:number = 15):[string, () => void]{
    const [id, setId] = useState(generateString(length))

    return [
        id,
        ()=>{
            setId(generateString(length))
        }
    ]
}