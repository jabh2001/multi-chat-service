import useSeparatedConversations from "../../../hooks/useSeparatedConversations";
// import { useMessageCount } from "src/hooks/useMessageCount";
import ChatsDiv from "../../../components/ChatsDiv";

export default function ConversationSection(){
  const { conversations, mineConversation, unassignedConversation } = useSeparatedConversations()
  // const { all, mine, unassigned} = useMessageCount()
    return (
      <section className="flex flex-col flex-none overflow-auto w-24  group lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out max-h-screen">
        <div className="search-box p-4 flex-none">
            <form>
                <div className="relative">
                    <label>
                        <input className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                              type="text" value="" placeholder="Search Messenger"/>
                        <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                            <svg viewBox="0 0 24 24" className="w-6 h-6">
                                <path fill="#bbb"
                                      d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                            </svg>
                        </span>
                    </label>
                </div>
            </form>
        </div>
        <div className="contacts p-2 flex-1 overflow-y-scroll">
            <ChatsDiv conversations={conversations} prefix={"chatsAll"} />
            <ChatsDiv conversations={mineConversation} prefix={"chatsMine"} />
            <ChatsDiv conversations={unassignedConversation} prefix={"chatsUnassigned"} />
        </div>
    </section>
    )
}