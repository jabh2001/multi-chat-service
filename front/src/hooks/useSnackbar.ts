import { useState } from "react"

export default function useSnackbar(){
    const [open, setOpen] = useState(true)
    const [message, setMessage] = useState<string[]>([])
    const [ color, setColor] = useState("error") as any

    return {
        open,
        handleClose(){
            setOpen(false)
        },
        message,
        setMessage,
        color,
        setColor,
        error(...messages:string[]){
            setColor("error")
            setMessage(messages)
            setOpen(true)
        },
        success(...messages:string[]){
            setColor("success")
            setMessage(messages)
            setOpen(true)
        },
        info(...messages:string[]){
            setColor("info")
            setMessage(messages)
            setOpen(true)
        },
        warning(...messages:string[]){
            setColor("warning")
            setMessage(messages)
            setOpen(true)
        },
        primary(...messages:string[]){
            setColor("primary")
            setMessage(messages)
            setOpen(true)
        },
        
    }
}