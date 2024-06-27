import { useMemo, useRef } from "react";
import Popup from "reactjs-popup";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import SocialMediaDisplay from "../../../components/SocialMediaDisplay";
import ContactLabelForm from "../../../components/form/ContactLabelForm";
import LabelIcon from "../../../components/icons/LabelIcon";
import { ContactType, LabelType } from "../../../types";
import useAuth from "../../../hooks/useAuth";
import { useConversationStore } from "../../../hooks/useConversations";
import { leaveConversation } from "../../../service/api";
// import { Badge } from "@/components/ui/badge";

export default function ContactCard({ contact:contactInfo, setContactInfo }:{ contact?:ContactType, setContactInfo?:any }){
    const conversation = useConversationStore(state => state.conversation);
    const user = useAuth(store => store.user)
    const teams = useAuth(store => store.teams)
    const isAssignedToMe = useMemo(() => conversation && user && conversation.assignedUserId  === user.id, [conversation, user])
    const isAssignedToMyTeam = useMemo(() => conversation && conversation.assignedTeamId && teams && teams.has(conversation.assignedTeamId), [conversation, teams])

    const handleLeaveOfCOnversation = async () => {
        try {
            conversation && await leaveConversation(conversation.id)
        } catch (e){}
    }


    const color = useRef(labelsColors()).current
    if(!contactInfo){
        return <></>
    }
    return (
        <div className="bg-slate-900 h-full">
            <div className="h-64 overflow-hidden flex flex-col justify-center">
                <img className="w-full object-cover blur" src={contactInfo.avatarUrl} alt="" />
            </div>
            <div className="w-full flex justify-center h-32 relative">
                <div className=" absolute rounded-full p-1 bg-white w-64 bg-gradient-to-tr from-sky-400 to-green-400 translate-y-[-50%]">
                    <img className="rounded-full w-full aspect-square object-cover" src={contactInfo.avatarUrl} alt="" />
                </div>
            </div>
            <div className="flex justify-center items-center gap-2 p-2" >

                <h3 className="text-gray-100 text-4xl text-center">{contactInfo.name}</h3>
                {setContactInfo && <Popup nested modal trigger={<button className="btn primary sm"><LabelIcon /></button>} >
                    {
                        ((close:any) => (
                            <div>
                                <ContactLabelForm 
                                    contactId={contactInfo.id} 
                                    name={contactInfo.name} 
                                    labels={contactInfo.labels} 
                                    setLabels={(labels:LabelType[]) => {
                                        setContactInfo(({...contactInfo, labels}))
                                        close()
                                    }}
                                />
                            </div>
                        )) as any
                    }
                </Popup>}
            </div>
            <div className="text-gray-200 p-2">
                <p className="text-2xl">Información personal</p>
                <div className="text-xl">
                { contactInfo.phoneNumber && <p>{contactInfo.phoneNumber}</p> } 
                { contactInfo.email && <p>{contactInfo.email}</p> } 
                <div>
                    <h4 className="text-lg pt-2 -mb-2">Etiquetas:</h4>

                    <ul className="flex gap-3 justify-start items-start flex-wrap py-2">
                        {
                            contactInfo.labels?.map((label, index) => (
                                <li className={`px-2 rounded-md text-white font bold ${color.next().value}`} key={index}>{label.name}</li>
                            ))
                        }
                    </ul>
                </div>
                </div>
            </div>
            <div>
                <p className="text-2xl pl-2">Redes sociales</p>
                <ScrollArea  className={"bg-gray-700 hover:bg-gray-600 transition py-1"}>
                    <div className="flex gap-8 p-2 justify-start">
                        {
                            contactInfo.socialMedia && contactInfo.socialMedia?.map(el => <SocialMediaDisplay key={`social_media_display_${el.id}`} socialMedia={el} /> )
                        }
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            {
                ( isAssignedToMe && (
                    <div className="px-4 text-center pt-4 text-xl">
                        <p>Este chat esta asignado a ti, puedes liberar el chat <button onClick={handleLeaveOfCOnversation} className="btn primary sm mx-2">Aquí</button></p>
                    </div>
                ))
            }
            {
                ( isAssignedToMyTeam && (
                    <div className="px-4 text-center pt-4 text-xl">
                        <p>Este chat esta asignado a tu equipo</p>
                    </div>
                ))
            }
        </div>
    )
}

function* labelsColors(){
    const  colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500",  "bg-green-500", "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-pink-500", "bg-gray-500"]
    let i = Math.floor(Math.random() * colors.length)
    while(true){
        yield colors[i]
        i++
        if( i >= colors.length){
            i = 0
        }
    }

}