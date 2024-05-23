import { useRef } from "react";
import { MessageType } from "../types";
import { useLocalStorage } from "./useLocalStorage";

type Key = string | number | boolean
type Params = {
    key: Key[];
}
export default function useChat({ key }:Params){
    const ids = useRef<Set<number>>(new Set())
    const [messages, setMessages_] = useLocalStorage<MessageType[]>(["multiChat", "conversation", "message", ...key].join("-"), [], { serializer:obj => JSON.stringify(obj), deserializer:(str) => JSON.parse(str) })
    
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