import { MessageType } from "./libs/schemas"

export type TeamType = {
    id:number
    name:string
    description:string
}
export type LabelType = {
    id:number
    name:string
    description:string
}
export type UserType = {
    id:number
    name:string
    email:string
    role:"admin" | "agent"
    teams:TeamType[]
}
export type AgentType = UserType

export type SocialMediaType = {
    id:number
    name:"facebook" | "gmail" | "instagram" | "whatsapp" | "telegram" | "linkedin" | "threads"
    url:string
    displayText:string
}

export type ContactType = {
    id:number
    name:string
    email?:string 
    phoneNumber:string
    avatarUrl:string
    labels:LabelType[]
    socialMedia:SocialMediaType[]
}

export type InboxType = {
    id:number
    name:string
    channel_type:"api" | "whats-app" | "telegram"
}

export type ConversationType = {
    id: number,
    contact:ContactType,
    inbox:InboxType,
    messageCount:number | string,
    messages:MessageType[],
}

export type WSMessageUpsertType = ContactType & { 
    base64Buffer:Base64Buffer|null
    conversation:ConversationType
    text:string | null | undefined 
    fromMe:boolean
    messageID:string
    listBufferBase64?: Base64Buffer[]
}

export type Base64Buffer= {
    base64:string |null,
    tipo:string|null,
    caption?:string|null
}

export type ImageMessage = {
    image:Buffer
}

export type AudioMessage = {
    audio: Buffer
}

export type VideoMessage = {
    video:Buffer
}
export type DocumentMessage = {
    document:Buffer
}
export type MediaMessageType =  Partial<ImageMessage & AudioMessage & VideoMessage & DocumentMessage > & { caption?:string, mimetype?:string, fileName?:string }