import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContactType } from "../../../types";
import { getContactById, getContactLabel, getSocialMedia } from "../../../service/api";
import PrevPageButton from "../../../components/button/PrevPageButton";
import ContactEditForm from "../../../components/form/ContactForm";
import SocialMediaForm from "../../../components/form/SocialMediaForm";
import ContactCard from "../../../components/cards/ContactCard";
import { useSSE } from "../../../hooks/useSSE";
import SocialMediaIcon from "../../../components/icons/SocialMediaIcon";

export default function ContactDetailPage(){
    const listener = useSSE()
    const [ _toast, setToast ] = useState({ msg:"", open:false})
    const { contactId } = useParams() as { contactId:string};
    const [contactInfo, setContactInfo] = useState<ContactType>()

    const openToast = (msg:string) => setToast({ msg, open:true})
    // const _closeToast = () => setToast({ msg:"", open:false})

    useEffect(()=>{
        if(listener){
            const list = listener.on("update-contact", ({ id, avatarUrl, ...contact}) => {
                if (id === Number(contactId)){
                    setContactInfo(c => ({...c, ...contact as any, avatarUrl: avatarUrl ? `data:image/png;base64,${avatarUrl}` : c?.avatarUrl}))
                }
            })
            return ()=> { 
                listener.remove('update-contact', list)
            }
        }
    }, [listener])

    useEffect(()=>{
        const getData = async ()=>{
            const retContact = getContactById(Number(contactId))
            const retSocialMedia = getSocialMedia(Number(contactId));
            const retLabels = getContactLabel(Number(contactId));
            const [contact, socialMedia, labels] = await Promise.all([ retContact, retSocialMedia, retLabels])
            document.title = `Contact - ${contact.name}`
            setContactInfo({...contact, socialMedia, labels})
        }
        const prevTitle = document.title
        getData()
        return () => {
            document.title = prevTitle
        }
    }, [contactId])

    if(!contactInfo){
        return <div>Loading...</div>
    }

    return (
        <div className="grid grid-cols-4 bg-gray-200 h-screen overflow-y-scroll ">
            <div className="col-span-3 flex flex-col">
                <div className="h-16 bg-white border-b-2 border-gray-400 flex items-center px-4">
                    
                    <div>
                        <PrevPageButton title="Contacts" />
                    </div>
                </div>
                <div className="mt-16 px-8 grid grid-cols-3 gap-4 flex-1items-stretch pb-8">
                    <div className="col-start-1 flex flex-col gap-8">
                        <div>
                            <div className="bg-white rounded-t-3xl">
                                <h3 className="border-b-2 border-gray-200 text-gray-700 text-3xl text-center py-2">Editar datos</h3>
                                <div className="px-3 pb-4">

                                    <ContactEditForm edited={contactInfo} onEdit={()=>openToast("Se ha actualizado el contacto")} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white rounded-t-3xl">
                                <h3 className="border-b-2 border-gray-200 text-gray-700 text-3xl text-center py-2">Añadir red social</h3>
                                <div className="px-3 pb-4">
                                    <SocialMediaForm onAdd={(newSocialMedia) => {
                                        setContactInfo(old => {
                                            return old ? {...old, socialMedia: [...old.socialMedia, newSocialMedia]} : undefined;
                                        })
                                        openToast("Se ha añadido la nueva red social")
                                    }}/>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="flex justify-center">
                            <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                                <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                                    <h4 className="text-xl font-semibold text-black">
                                        Redes sociales de {contactInfo.name}
                                    </h4>
                                </div>

                                <div className="grid grid-cols-3 border-b border-slate-300 py-4 px-4  md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                                    <div className="col-span-1 flex items-center">
                                        <p className="font-medium">Medio</p>
                                    </div>
                                    <div className="col-span-1 hidden items-center sm:flex">
                                        <p className="font-medium">nombre</p>
                                    </div>
                                    <div className="col-span-1 flex items-center">
                                        <p className="font-medium">ir</p>
                                    </div>
                                </div>
                                <div className="max-h-[65vh] overflow-y-scroll">
                                    {contactInfo.socialMedia.map(({ id, displayText, name, url }) => (
                                        <div
                                            className="grid grid-cols-3 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6"
                                            key={"fastMediaMessage" + id}
                                        >
                                            <div className="col-span-1 items-center flex gap-2">
                                                <SocialMediaIcon socialMedia={name} />
                                                <p className="text-sm text-black">
                                                    {name}
                                                </p>
                                            </div>
                                            <div className="col-span-1 items-center flex">
                                                <p className="text-sm text-black">
                                                    {displayText}
                                                </p>
                                            </div>
                                            <div className="col-span-1 items-center flex">
                                                <a href={url} target="_blank" className="btn primary link">
                                                    Ver perfil
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-gray-200 border-l-2 relative">
                <ContactCard contact={contactInfo} setContactInfo={setContactInfo} />

            </div>
        </div>
    )
}