import { RefObject, useEffect, useRef } from "react";
import { MessageType } from "../../types";
import ChatMessage from "../ChatMessage";
import { useWebSocket } from '../chatContainer';
import LoadingMoreMessage from "../ChatMessage/LoadingMoreMessage";

type Props = {
    messages:MessageType[]
    addMessage:(msg:MessageType) => void
    rootRef:RefObject<HTMLDivElement>
    observeRef:RefObject<HTMLDivElement>
    fetchMoreMessage?:() => Promise<void>
    isLoading?:boolean
    isComplete?:boolean
}

export default function MessageList({ messages, addMessage, rootRef, observeRef, fetchMoreMessage, isLoading, isComplete }:Props){
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
    return (
        <section style={{ width:"100%", display:"flex", flexDirection:"column-reverse"}}>
            {
                messages.map( (m, i)=>(
                    <ChatMessage 
                        key={`msg_${m.id}`}
                        message={m}
                        ref={
                            i === 0 ? lastMessageRef : 
                            i === 1 ? prevLastMessageRef :
                            i === messages.length-1 ? observeRef : undefined
                        }
                    />
                ))
            }
            { isLoading && <LoadingMoreMessage /> }
            { isComplete && <>Completo</> }
        </section>
    )
}

function isInViewport(element:HTMLElement){
    const distance = element.getBoundingClientRect();
    const parentViewport = element.parentElement?.parentElement?.getBoundingClientRect();
    if(!parentViewport){
        return false
    }
    return distance.top < parentViewport.bottom && distance.bottom > parentViewport.top
}