import { forwardRef } from "react"
import { MessageGroupType } from "../../../../types"
import Message from "../message"

const MessageGroup = forwardRef<HTMLDivElement, MessageGroupType>(({ messages, contact }, ref) => {
    return (
        <div className={`flex flex-row ${contact ? "justify-start" : "justify-end"}`} ref={ref}>
            {
                contact && (
                <div className="w-8 h-8 relative flex flex-shrink-0 mr-4">
                    <img className="shadow-md rounded-full w-full h-full object-cover"
                        src={contact.avatarUrl}
                        alt={contact.name}
                    />
                </div>
                )
            }
            <div className="messages text-sm text-gray-700 flex flex-col-reverse gap-2">
                {
                    messages.map((m, i) => (
                        <Message
                            key={`msg_${m.id}`}
                            {...m}
                            position={
                                i === 0 ? "bottom" :
                                i === messages.length - 1 ? "top" : 
                                "center"
                            }
                        />
                    ))
                }
            </div>
        </div>
    )
})
export default MessageGroup