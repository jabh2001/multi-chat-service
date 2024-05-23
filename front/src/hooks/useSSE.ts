import { createContext, useContext } from "react";
import { MultiChatSSE } from "../libs/MultiChatSSE";

export const context = createContext<MultiChatSSE | null>(null)

export const useSSE = () => useContext(context)