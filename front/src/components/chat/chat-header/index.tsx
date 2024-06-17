import { useConversationStore } from "../../../hooks/useConversations"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
import ContactCard from "../../../components/cards/ContactCard";

export default function ChatHeader(){
    const conversation = useConversationStore(state => state.conversation);
    return (
        <div className="chat-header px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
            <div className="flex">
                <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                    <img className="shadow-md rounded-full w-full h-full object-cover"
                        src={conversation?.contact.avatarUrl}
                        alt=""
                    />
                </div>
                <div className="text-sm">
                    <p className="font-bold">{conversation?.contact.name}</p>
                    <p>{ conversation?.inbox.name }</p>
                </div>
            </div>

            <div className="flex">
            <ContactData>
                <button className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2 ml-4">
                    <svg viewBox="0 0 20 20" className="w-full h-full fill-current text-blue-500">
                        <path d="M2.92893219,17.0710678 C6.83417511,20.9763107 13.1658249,20.9763107 17.0710678,17.0710678 C20.9763107,13.1658249 20.9763107,6.83417511 17.0710678,2.92893219 C13.1658249,-0.976310729 6.83417511,-0.976310729 2.92893219,2.92893219 C-0.976310729,6.83417511 -0.976310729,13.1658249 2.92893219,17.0710678 Z M9,11 L9,10.5 L9,9 L11,9 L11,15 L9,15 L9,11 Z M9,5 L11,5 L11,7 L9,7 L9,5 Z"/>
                    </svg>
                </button>
            </ContactData>
            </div>
        </div>
    )
}

const ContactData = ({ children }:any) => {
    const contact = useConversationStore(store => store.contact)
    if(!contact){
        return children
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[64rem] p-0" >
                {/* <SheetHeader>
                    <SheetTitle>Información del contacto</SheetTitle>
                </SheetHeader> */}
                <div className="absolute w-full h-full">
                    <ContactCard contact={contact} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

// function ContactCard({ contact:{ avatarUrl, name, socialMedia}}:{ contact:ContactType}){
//     return (
//         <div className="flex items-center p-3 w-full h-28 bg-white rounded-md shadow-lg">
//             <section className="flex justify-center items-center w-14 h-14 rounded-full shadow-md bg-gradient-to-r from-[#F9C97C] to-[#A2E9C1] hover:from-[#C9A9E9] hover:to-[#7EE7FC] hover:cursor-pointer hover:scale-110 duration-300">
//                 <img src={avatarUrl} className="rounded-full object-cover" alt="" />
//             </section>

//             <section className="block border-l border-gray-300 m-3">
//                 <div className="pl-3">
//                     <h3 className="bg-clip-text text-transparent bg-gradient-to-l from-[#005BC4] to-[#27272A] text-xl font-bold">
//                         {name}
//                     </h3>
//                 </div>
//                 <div className="flex flex-wrap gap-3 pt-2 pl-3 text-red-500">
                    
//                     <svg stroke="currentColor" viewBox="0 0 24 24" className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-white stroke-2">
//                         <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22">
//                         </path>
//                     </svg>
//                     <svg stroke="currentColor" viewBox="0 0 24 24" className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-white stroke-2">
//                         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z">
//                         </path>
//                         <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
//                     </svg>
//                     <svg stroke="currentColor" viewBox="0 0 24 24" className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-white stroke-2">
//                         <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
//                         </path>
//                     </svg>
//                     <svg stroke="currentColor" viewBox="0 0 24 24" className="w-4 hover:scale-125 duration-200 hover:cursor-pointer fill-white stroke-2">
//                         <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>
//                     </svg>
//                 </div>
//             </section>
//         </div>
//     )
// }