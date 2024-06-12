import { useEffect, useRef, useState } from "react";
import { MessageGroupType, MessageType } from "../types";
import { useConversationStore } from "./useConversations";

export default function useChat(dependencies:any[]){
    const ids = useRef<Set<number>>(new Set())
    const [messages, setMessages_] = useState<MessageType[]>([])
    const [ messagesGroup, setMessagesGroup ] = useState<MessageGroupType[]>([])
    const contact = useConversationStore(state => state.contact)
    
    useEffect(() => {
        ids.current = new Set()
        setMessages_([])
    }, dependencies)
    
    useEffect(() => {
        setMessagesGroup( messages.reduce((accumulator:MessageGroupType[], current:MessageType) => {
            if(accumulator.length === 0){
              accumulator.push({ contact:current.messageType === "incoming" ? contact : undefined, messages:[current]})
            } else {
              const lastIndex = accumulator.length - 1
              if(accumulator[lastIndex].contact) {
                if(current.messageType === "incoming"){
                  accumulator[lastIndex].messages.push(current)
                } else {
                  accumulator.push({ messages:[current]})
                }
              } else {
                if(current.messageType === "incoming"){
                  accumulator.push({ contact, messages:[current]})
                } else {
                  accumulator[lastIndex].messages.push(current)
                }
              }
            }
            return accumulator
          }, []))
    }, [messages])
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
        insertMessages,
        messagesGroup
    }
}
