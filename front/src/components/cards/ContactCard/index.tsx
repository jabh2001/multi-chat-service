import CircleAvatar from "../../../components/avatar/CircleAvatar";
import SocialMediaDisplay from "../../../components/SocialMediaDisplay";
import { ContactType } from "../../../types";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneIcon } from "../../../components/icons";
import GmailIcon from "../../../components/icons/SocialMediaIcon/GmailIcon";
// import { Badge } from "@/components/ui/badge";

export default function ContactCard({ contact }:{ contact?:ContactType }){
    if(!contact){
        return <></>
    }
    return (
        <div className={"flex justify-between flex-col h-full m-4 shadow shadow-gray-500"}>
            <div className={"w-1/2 m-auto"}>
                <CircleAvatar src={contact.avatarUrl} alt={contact.email} size="full" />
            </div>
            <div className={"px-4"}>
                <div className={"flex justify-between py-4"}>
                    <h3 className={"text-3xl"}>{contact?.name}</h3>
                    <Link className={buttonVariants({ size:"sm"})} to={`/contacts/${contact.id}`}>
                        Editar este contacto
                    </Link>
                </div>
                <div className="text-xl py-4 fill-white">
                    {contact.email && 
                        <div className="grid grid-cols-[24px_1fr] items-center gap-4">
                            <GmailIcon/>
                            <p>{contact.email}</p>
                        </div>
                    }
                    <div className="grid grid-cols-[24px_1fr] items-center gap-4">
                        <PhoneIcon/>
                        <p>{contact.phoneNumber}</p>
                    </div>
                </div>
            </div>
                <ScrollArea className={"h-32 border border-gray-200 border-x-0"}>
                    <div className={"flex gap-4 p-2 justify-start flex-wrap bg-gray-400/10 hover:bg-gray-400/20 transition"}>
                        {
                            contact.socialMedia?.length > 0 ? 
                            contact.socialMedia.map(el => <SocialMediaDisplay key={`social_media_display_${el.id}`} socialMedia={el} /> ) : 
                            <p>Esta cuenta no tiene ninguna red social <Link className={buttonVariants({ size:"sm", variant:"link"})} to={`/contacts/${contact.id}`}>asigna una</Link></p>
                        }
                    </div>
                </ScrollArea>
        </div>
    )
}