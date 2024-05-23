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
    teams?:TeamType[]
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
    email:string
     
    phoneNumber:string
    avatarUrl:string
    labels:LabelType[]
    socialMedia:SocialMediaType[]
}

export type InboxType = {
    id:number
    name:string
    channelType:"api" | "whats-app" | "telegram"
    user:any
    qr:string
}

export type ConversationType = {
    id: number,
    inboxId: number,
    senderId: number,
    assignedUserId: number | null,
    assignedTeamId: number | null,
    contact:ContactType,
    inbox:InboxType,
    lastMessage:string,
    lastMessageDate:string,
    messageCount:number | string,
    messages:MessageType[],
}
export type MessageType = {
    buffer:string,
    id: number,
    content:string
    contentType:string
    messageType:"incoming" | "outgoing" | "info"
    private:boolean
    created_at:Date
    user?:Partial<UserType>
}