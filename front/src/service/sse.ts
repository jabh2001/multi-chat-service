import { MultiChatSSE } from "../libs/MultiChatSSE"

export function getEventSource(){
    return new MultiChatSSE()
}