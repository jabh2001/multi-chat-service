import "./styles.css"
import ConversationSection from "../../components/chat/conversation-section"
import Chat from "../../components/chat"
function ChatPage() {
  
  return (
  <main className="flex-grow flex flex-row min-h-0 max-h-screen h-screen">
    <ConversationSection />
    <Chat />
  </main>
  )
}

export default ChatPage