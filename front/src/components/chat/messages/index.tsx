import { RefObject, useEffect, useRef } from "react";
import { MessageGroupType, MessageType } from "../../../types";
import MessageGroup from "./message-group";
import LoadingMoreMessage from "../../../components/ChatMessage/LoadingMoreMessage";
import { useWebSocket } from "../index";

type Props = {
    messages:MessageGroupType[] 
    addMessage:(msg:MessageType) => void
    rootRef:RefObject<HTMLDivElement>
    observeRef:RefObject<HTMLDivElement>
    fetchMoreMessage?:() => Promise<void>
    isLoading?:boolean
    isComplete?:boolean
}
export default function Messages({ messages, addMessage, observeRef, rootRef, fetchMoreMessage, isLoading, isComplete }:Props){
    const prevLastMessageRef = useRef<HTMLDivElement>(null)
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const ws= useWebSocket()
    const scrollToLast = () => {
        prevLastMessageRef.current && isInViewport(prevLastMessageRef.current) && lastMessageRef.current?.scrollIntoView()
    }
    useEffect(()=>{
        if (ws) {
            const receiptMessage = ({ data }:MessageEvent<any>)=>{
                const message = JSON.parse(data);
                addMessage(message)
            }
            ws.onmessage = receiptMessage
            return () => {ws.onmessage = null}
        }
    }, [ws])
    useEffect(()=>{
        scrollToLast()
    }, [messages])
    useEffect(()=>{
        const onScroll = () =>{
            observeRef.current && isInViewport(observeRef.current) && !isLoading && fetchMoreMessage && fetchMoreMessage()
        }
        rootRef.current?.addEventListener("scrollend", onScroll)
        return () => {
            rootRef.current?.removeEventListener("scrollend", onScroll)
        }
    }, [fetchMoreMessage])
    
    return <>
        {
            messages.map(({ messages:m, contact }, i) => (
                <MessageGroup
                    key={`group_${i}`}
                    contact={contact}
                    messages={m}
                    ref={(
                        i === 0 ? lastMessageRef : 
                        i === 1 ? prevLastMessageRef :
                        i === messages.length-1 ? observeRef : undefined
                    )}
                />
            ) )
        }
        { isLoading && <LoadingMoreMessage /> }
        { isComplete && <>Completo</> }
    </>
}

function isInViewport(element:HTMLElement){
    const distance = element.getBoundingClientRect();
    const parentViewport = element.parentElement?.parentElement?.getBoundingClientRect();
    if(!parentViewport){
        return false
    }
    return distance.top < parentViewport.bottom && distance.bottom > parentViewport.top
}