import { useMemo } from "react"

interface CardProps {
    avatarUrl: string,
    contactName: string
    shortMessage: string
    viewTransitionName:string
    onClick?:React.MouseEventHandler<HTMLElement>
    messageCount?:string|number
    active?:boolean
}

const ChatCard: React.FC<CardProps> = (props) => {
    const { contactName, shortMessage, avatarUrl, onClick, viewTransitionName, messageCount, active } = props;
    const isNewMessage = useMemo(() =>  messageCount !== 0 && messageCount !== "0", [messageCount])

    return (
        <div className={`flex justify-between items-center p-3 relative rounded-lg ${active ? "bg-gray-800" : "hover:bg-gray-800"} cursor-pointer`} onClick={onClick}>
            <div className="w-16 h-16 relative flex flex-shrink-0">
                <img className="shadow-md rounded-full w-full h-full object-cover"  style={{ viewTransitionName}}
                    src={avatarUrl}
                    alt=""
                />
            </div>
            <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block -group-hover:block">
                <p>{contactName}</p>
                <div className={`flex items-center text-sm ${ isNewMessage ? "font-bold" : "text-gray-600"}`}>
                    <div className="min-w-0">
                        <p className="truncate">{shortMessage?.slice(0, 30)} {shortMessage?.length > 30  ? '...' : ''}</p>
                    </div>
                    <p className="ml-2 whitespace-no-wrap">Just now</p>
                </div>
            </div>
            {
                isNewMessage && <div className="bg-blue-700 size-4 rounded-full flex flex-shrink-0 md:block absolute md:relative right-1 top-3 -group-hover:block"></div>
            }
        </div>
    );
};

/*

              <div className="bg-blue-700 w-3 h-3 rounded-full flex flex-shrink-0 hidden md:block group-hover:block"></div>
*/
// const ChatCard: React.FC<CardProps> = (props) => {
//     const { inboxName, contactName, shortMessage, avatarUrl, onClick, viewTransitionName, messageCount } = props;

//     return (
//         <button className={style.card} onClick={onClick} style={{ viewTransitionName}}>
//             <CircleAvatar src={avatarUrl} alt={contactName} />
//             <div className={style.info}>
//                 <p className={style.inboxName}> {inboxName}</p>
//                 <p className={style.contactName}>{contactName}</p>
//                 <p className={style.shortMessage}>{shortMessage?.slice(0, 30)} {shortMessage?.length > 30  ? '...' : ''}</p>
//             </div>
//             {
//                messageCount && messageCount !== "0" && messageCount !== 0 && <span className={style.messageCount}>{messageCount}</span> 
//             }
//         </button>
//     );
// };
export default ChatCard;