import { create } from "zustand";
import { ContactType, ConversationType, MessageType } from "../types";
import { useEffect, useRef, useState } from "react";
import useChat from "./useChat";
import { getAllMessage, getSocialMedia } from "../service/api";

type ConversationsStoreType = {
    conversation:ConversationType | undefined,
    setConversationId:(conversation:ConversationType) => void,
    contact:ContactType | undefined,
    setContact:(contact:ContactType) => void,
}
export const useConversationStore = create<ConversationsStoreType>(set=>({
    conversation: undefined,
    setConversationId:(conversation)=>set({ conversation }),
    contact:undefined,
    setContact:(c)=>set({  contact: c })
}))

export const useConversation = ()=>{
  const conversation = useConversationStore(state => state.conversation)
  const setContact = useConversationStore(state => state.setContact)
  const contact = useConversationStore(state => state.contact)
  const { messages, setMessages, pushMessages, insertMessages:insert} = useChat([conversation])

  const [ isLoading, setIsLoading ] = useState(false)
  const [ isComplete, setIsComplete ] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const observeRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
      if(conversation && contact){
          setIsLoading(true)
          getAllMessage(conversation.inbox.id, conversation.id).then(msg => {
            setMessages(msg)
            setIsLoading(false)
            scrollToBottom()
          })
          getSocialMedia(conversation.contact.id).then(socialMedia =>setContact({...contact, socialMedia}))
      }
  }, [conversation])

  const scrollToBottom = () => {
    if(rootRef.current){
      rootRef.current.scroll(0, rootRef.current.scrollHeight)
    }
  }

  const fetchMoreMessage =  async  () => {
    if(conversation && contact){
      if(!isComplete && !isLoading && messages.length > 0){
          setIsLoading(true)
          const element = observeRef.current
          console.log(1)
          const newMessages = await getAllMessage(conversation.inbox.id, conversation.id, messages.length)
          console.log(12)
          if(newMessages.length ==0){
            setIsComplete(true)
            setIsLoading(false)
            return 
          }
          pushMessages(...newMessages)
          setTimeout(() => {
            element?.scrollIntoView({ behavior:"instant", block:"start" })
          }, 250)
          
          setIsLoading(false)
        }
    }
  }

  return {
    messages,
    rootRef,
    observeRef,
    pushMessages,
    insertMessages:(...messages:MessageType[]) =>{
      insert(...messages)
      // scrollToBottom()
    },
    fetchMoreMessage,
    isLoading,
    isComplete,
  }
}