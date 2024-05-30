import { useEffect, useRef, useState } from "react";
import { MessageType } from "../types";

export default function useChat(dependencies:any[]){
    const ids = useRef<Set<number>>(new Set())
    const [messages, setMessages_] = useState<MessageType[]>([])
    
    useEffect(() => {
        ids.current = new Set()
        setMessages_([])
    }, dependencies)
    const setMessages = (messages:MessageType[]) => {
            setMessages_(messages)
            ids.current = new Set(messages.map(m => m.id))
    }

    const pushMessages = (...message:MessageType[])=>{
        setMessages_(prev =>[...prev, ...message.filter(m => !ids.current.has(m.id))]);
    }

    const insertMessages = (...message:MessageType[])=>{
        setMessages_(prev =>[...message.filter(m => !ids.current.has(m.id)), ...prev]);
    }


    return {
        messages,
        setMessages,
        pushMessages,
        insertMessages
    }
}