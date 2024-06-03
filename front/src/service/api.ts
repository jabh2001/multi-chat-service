import axios from "axios";
import { AgentType, ContactType, ConversationType, InboxType, LabelType, MessageType, SocialMediaType, TeamType, UserType } from "../types";
import { ConversationNoteType, FastMessageType } from "../libs/schemas";

const baseURL = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : import.meta.env.VITE_PROD_API_URL

const instance = axios.create({ baseURL, withCredentials: true })

export async function testCookie() {
    await instance.post("/login", { "email": import.meta.env.VITE_ADMIN_EMAIL, "password": import.meta.env.VITE_ADMIN_PASSWORD })
}
export async function signIn(email: string, password: string) {
    try {
        const { data } = await instance.post<LoginResponse>("/login", { email, password })
        return data
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function signOut() {
    try {
        const { data } = await instance.post<{ status: boolean }>("/logout")
        return data
    } catch (e) {
        return Promise.reject(e)
    }
}
/************************************* LABELS ******************************************************************/
export async function getLabels() {
    try {
        const { data } = await instance.get<{ labels: LabelType[] }>("/label")
        const { labels } = data
        return labels
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function postLabel(label: Omit<LabelType, "id">) {
    try {
        const { data } = await instance.post<{ label: LabelType }>("/label", label)
        const { label: newLabel } = data
        return newLabel
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putLabel(id: LabelType["id"], newData: Partial<LabelType>) {
    try {
        const { data } = await instance.put<{ label: LabelType }>("/label/" + id, newData)
        const { label } = data
        return label
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function deleteLabel(id: LabelType["id"]) {
    try {
        const { data } = await instance.delete<{ label: LabelType }>("/label/" + id)
        const { label } = data
        return label
    } catch (e) {
        return Promise.reject(e)
    }
}


/************************************* TEAMS ******************************************************************/
export async function getTeams() {
    try {
        const { data } = await instance.get<{ teams: TeamType[] }>("/team")
        const { teams } = data
        return teams
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function postTeam(team: Omit<TeamType, "id">) {
    try {
        const { data } = await instance.post<{ team: TeamType }>("/team", team)
        const { team: newTeam } = data
        return newTeam
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putTeam(id: TeamType["id"], newData: Partial<TeamType>) {
    try {
        const { data } = await instance.put<{ team: TeamType }>("/team/" + id, newData)
        const { team } = data
        return team
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function deleteTeam(id: TeamType["id"]) {
    try {
        const { data } = await instance.delete<{ team: TeamType }>("/team/" + id)
        const { team } = data
        return team
    } catch (e) {
        return Promise.reject(e)
    }
}


/************************************* AGENTS ******************************************************************/
export async function getAgents() {
    try {
        const { data } = await instance.get<{ agents: AgentType[] }>("/agent")
        const { agents } = data
        return agents
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function postAgent(agent: Omit<AgentType, "id">) {
    try {
        const { data } = await instance.post<{ agent: AgentType }>("/agent", agent)
        const { agent: newAgent } = data
        return newAgent
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putAgent(id: AgentType["id"], newData: Partial<AgentType>) {
    try {
        const { data } = await instance.put<{ agent: AgentType }>("/agent/" + id, newData)
        const { agent } = data
        return agent
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function deleteAgent(id: AgentType["id"]) {
    try {
        const { data } = await instance.delete<{ agent: AgentType }>("/agent/" + id)
        const { agent } = data
        return agent
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function getAgentTeam(id: AgentType["id"]) {
    try {
        const { data } = await instance.get<{ teams: TeamType[] }>(`/agent/${id}/teams`)
        const { teams } = data
        return teams
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putAgentTeam(id: AgentType["id"], teamIds: TeamType["id"][]) {
    try {
        const { data } = await instance.put<{ teams: TeamType[] }>(`/agent/${id}/teams`, teamIds)
        const { teams } = data
        return teams
    } catch (e) {
        return Promise.reject(e)
    }
}
/************************************* CONTACTS ******************************************************************/
export async function getContacts(label: undefined | number = undefined) {
    try {
        const { data } = await instance.get<{ contacts: ContactType[] }>("/contact", { params: { label } })
        const { contacts } = data
        return contacts
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function getContactById(contactId: number) {
    try {
        const { data } = await instance.get<{ contact: ContactType }>("/contact/" + contactId)
        const { contact } = data
        return contact
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function postContact(contact: any) {
    try {
        const { data } = await instance.post<{ contact: ContactType }>("/contact", contact)
        const { contact: newContact } = data
        return newContact
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putContact(id: ContactType["id"], newData: any) {
    try {
        const { data } = await instance.put<{ contact: ContactType }>("/contact/" + id, newData)
        const { contact } = data
        return contact
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function deleteContact(id: ContactType["id"]) {
    try {
        const { data } = await instance.delete<{ contact: ContactType }>("/contact/" + id)
        const { contact } = data
        return contact
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function getContactLabel(id: ContactType["id"]) {
    try {
        const { data } = await instance.get<{ labels: LabelType[] }>("/contact/" + id + "/labels")
        const { labels } = data
        return labels
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putContactLabel(id: ContactType["id"], labelIds: LabelType["id"][]) {
    try {
        const { data } = await instance.put<{ labels: LabelType[] }>("/contact/" + id + "/labels", labelIds)
        const { labels } = data
        return labels
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function getSocialMedia(id: ContactType["id"]) {
    try {
        const { data } = await instance.get<{ socialMedia: SocialMediaType[] }>(`/contact/${id}/social-media`)
        const { socialMedia } = data
        return socialMedia
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function postSocialMedia(id: ContactType["id"], newData: Omit<SocialMediaType, "id">) {
    try {
        const { data } = await instance.post<{ socialMedia: SocialMediaType }>(`/contact/${id}/social-media`, newData)
        const { socialMedia } = data
        return socialMedia
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putSocialMedia(contactId: ContactType["id"], socialMediaId: SocialMediaType["id"], newData: Partial<SocialMediaType>) {
    try {
        const { data } = await instance.put<{ socialMedia: SocialMediaType }>(`/contact/${contactId}/social-media/${socialMediaId}`, newData)
        const { socialMedia } = data
        return socialMedia
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function sendMessageToContact(contactId: number, inboxName: string, message: string) {
    try {
        const { data } = await instance.post<{ message: MessageType }>(`/contact/${contactId}/message`, { inboxName, message })
        const { message: msg } = data
        return msg
    } catch (e) {
        return Promise.reject(e)
    }
}
/************************************* CONVERSATIONS ******************************************************************/

export async function getInboxes() {
    try {
        const { data } = await instance.get<{ inboxes: InboxType[] }>("/inbox")
        return data.inboxes
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function postInbox(inbox: { name: string, channelType: string, token?:string }) {
    try {
        const { data } = await instance.post<{ inbox: InboxType }>("/inbox", inbox)
        return data.inbox
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function inboxLogout(inboxId:any){
    try {
        const { data } = await instance.post<{ inbox: InboxType }>(`/inbox/${inboxId}/log-out`)
        return data.inbox
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function deleteInbox(inboxId:any){
    try {
        const { data } = await instance.delete<{ inbox: InboxType }>(`/inbox/${inboxId}`)
        return data.inbox
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function getAllConversations({ inbox, label }: { inbox?: string, label?: string } = {}) {
    try {
        const { data } = await instance.get<{ conversations: ConversationType[] }>("/conversation", { params: { inbox, label } })
        return data.conversations
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function assignedConversation(inboxId:number, conversationId:number, { user, team }:{user?:number, team?:number}) {
    try {
        const { data } = await instance.put<{ conversation: ConversationType }>(`inbox/${inboxId}/conversation/${conversationId}`, { assignedUserId:user || null, assignedTeamId:team || null })
        return data.conversation
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function getAllMessage(inboxId: InboxType["id"], conversationId: ConversationType["id"], offset?:number) {
    try {
        const { data } = await instance.get<{ messages: MessageType[] }>(`/inbox/${inboxId}/conversation/${conversationId}/message`, { params:{ offset } })
        return data.messages
    } catch (e) {
        return Promise.reject(e)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getConversationNotes(inboxId: InboxType["id"], conversationId: ConversationType["id"]) {
    try {
        const { data } = await instance.get<{ notes: ConversationNoteType[] }>(`/inbox/${inboxId}/conversation/${conversationId}/notes`)
        return data.notes
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function saveNewConversationNote(inboxId: InboxType["id"], conversationId: ConversationType["id"], note:Omit<ConversationNoteType, "id">) {
    try {
        const { data } = await instance.post<{ note: ConversationNoteType }>(`/inbox/${inboxId}/conversation/${conversationId}/notes`, {...note, conversationId})
        return data.note
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function getConversationNoteById(inboxId: InboxType["id"], conversationId: ConversationType["id"], noteId:ConversationNoteType["id"]) {
    try {
        const { data } = await instance.post<{ note: ConversationNoteType }>(`/inbox/${inboxId}/conversation/${conversationId}/notes/${noteId}`)
        return data.note
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function updateConversationNote(inboxId: InboxType["id"], conversationId: ConversationType["id"], noteId:ConversationNoteType["id"], note:Partial<ConversationNoteType>) {
    try {
        const { data } = await instance.put<{ note: ConversationNoteType }>(`/inbox/${inboxId}/conversation/${conversationId}/notes/${noteId}`, note)
        return data.note
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function deleteConversationNote(inboxId: InboxType["id"], conversationId: ConversationType["id"], noteId:ConversationNoteType["id"]) {
    try {
        const { data } = await instance.delete<{ note: ConversationNoteType }>(`/inbox/${inboxId}/conversation/${conversationId}/notes/${noteId}`)
        return data.note
    } catch (e) {
        return Promise.reject(e)
    }
}

/************************************* FAST MESSAGES ******************************************************************/
export async function getAllFastMessages(){
    try{
        const {data} = await instance.get('/fastMessages')
        return data
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function getFastMessages() {
    try {
        const { data } = await instance.get<{ fastMessages: FastMessageType[] }>("/fast-message")
        const { fastMessages } = data
        return fastMessages
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function postFastMessage(fastMessage: Omit<FastMessageType, "id">) {
    try {
        const { data } = await instance.post<{ fastMessage: FastMessageType }>("/fast-message", fastMessage)
        const { fastMessage: newFastMessage } = data
        return newFastMessage
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function putFastMessage(id: FastMessageType["id"], newData: Partial<FastMessageType>) {
    try {
        const { data } = await instance.put<{ fastMessage: FastMessageType }>("/fast-message/" + id, newData)
        const { fastMessage } = data
        return fastMessage
    } catch (e) {
        return Promise.reject(e)
    }
}
export async function deleteFastMessage(id: FastMessageType["id"]) {
    try {
        const { data } = await instance.delete<{ fastMessage: FastMessageType }>("/fast-message/" + id)
        const { fastMessage } = data
        return fastMessage
    } catch (e) {
        return Promise.reject(e)
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type LoginResponse = {
    "user": UserType
    "token": string
}