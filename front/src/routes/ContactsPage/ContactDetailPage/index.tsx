import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ContactType, LabelType } from "../../../types";
import { getContactById, getContactLabel, getSocialMedia, sendMessageToContact } from "../../../service/api";
import PrevPageButton from "../../../components/button/PrevPageButton";
import { TabsSlider, Tab } from "../../../components/TabsSlider";
import ContactEditForm from "../../../components/form/ContactForm";
import SocialMediaForm from "../../../components/form/SocialMediaForm";
import ContactLabelForm from "../../../components/form/ContactLabelForm";
import ContactCard from "../../../components/cards/ContactCard";
import { useSSE } from "../../../hooks/useSSE";
import Snackbar from "../../../components/Snackbar";
import styles from "./index.module.css"
import { Modal, ModalAction, ModalBody, ModalFooter, ModalHeader } from "../../../components/Modal";
import useInboxStore from "../../../hooks/useInboxStore";
import Select from "../../../components/form/inputs/Select";
import Option from "../../../components/form/inputs/Option";
import { useForm } from "react-hook-form";
import Textarea from "../../../components/form/inputs/Textarea";

export default function ContactDetailPage(){
    const listener = useSSE()
    const [ toast, setToast ] = useState({ msg:"", open:false})
    const [ page, setPage ] = useState(1)
    const { contactId } = useParams() as { contactId:string};
    const [contactInfo, setContactInfo] = useState<ContactType>()

    const openToast = (msg:string) => setToast({ msg, open:true})
    const closeToast = () => setToast({ msg:"", open:false})

    useEffect(()=>{
        if(listener){
            const list = listener.on("update-contact", ({ id, avatarUrl, ...contact}) => {
                if (id === Number(contactId)){
                    setContactInfo(c => ({...c, ...contact as any, avatarUrl:`data:image/png;base64,${avatarUrl}`}))
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
        <div className={styles.container}>
            <div className={styles.head}>
                <PrevPageButton title="Contacts" />
            </div>
            <div className={styles.contactInfo}>
                <ContactCard contact={contactInfo} />
                <div className={styles.changeTabsButton}>
                    <SendMessageFormModal contact={contactInfo} />
                    <button onClick={() => setPage(1)}><span>Edit Data</span><span>&gt;</span></button>
                    <button onClick={() => setPage(2)}><span>Set Social Media</span><span>&gt;</span></button>
                    <button onClick={() => setPage(3)}><span>Set Labels </span><span>&gt;</span></button>
                </div>
            </div>
            <div className={styles.tabs}>
                <TabsSlider page={page}>
                    <Tab visible={page == 1}>
                        <div className={styles.editContactForm}>
                            <ContactEditForm edited={contactInfo} onEdit={()=>openToast("Se ha actualizado el contacto")} />
                            <form className={styles.noteForm}>
                                <h4>Nota</h4>
                            </form>
                        </div>
                    </Tab>
                    <Tab visible={page == 2}>
                        <div className={styles.SocialMediaFormContainer}>
                            {
                                contactInfo.socialMedia?.map(sm => (
                                    <SocialMediaForm
                                        key={`social_media_${sm.id}`}
                                        edited={sm}
                                        onEdit={(newSocialMedia) => {
                                            setContactInfo(old => {
                                                return old ? {...old, socialMedia: old.socialMedia.map(sm => sm.id === newSocialMedia.id ? newSocialMedia : sm)} : undefined;
                                            })
                                            openToast("Se ha actualizado la red social")
                                        }}
                                    />
                                ))
                            }
                            
                            <SocialMediaForm onAdd={(newSocialMedia) => {
                                setContactInfo(old => {
                                    return old ? {...old, socialMedia: [...old.socialMedia, newSocialMedia]} : undefined;
                                })
                                openToast("Se ha añadido la nueva red social")
                            }}/>
                        </div>
                    </Tab>
                    <Tab visible={page == 3}>
                        <ContactLabelForm 
                            contactId={contactId} 
                            name={contactInfo.name} 
                            labels={contactInfo.labels} 
                            setLabels={(labels:LabelType[]) => {setContactInfo(({...contactInfo, labels}));openToast("Se han actualizado las etiquetas")}}
                        />
                    </Tab>
                </TabsSlider>
            </div>
            <Snackbar color="warning" open={toast.open} handleClose={closeToast} >
                { toast.msg || "Se ha actualizado"}
            </Snackbar>
        </div>
    )
}
type Inputs = {
    inboxName:string
    message:string
}
function SendMessageFormModal({ contact }:{ contact:ContactType}){
    const inboxes = useInboxStore(store => store.inboxes)
    const fetchInbox = useInboxStore(store => store.fetch)
    const [ open, setOpen ] = useState(false)
    const [ openSnackbar, setOpenSnackbar] = useState({ status:false, msg:"" })
    const { control, handleSubmit, reset } = useForm<Inputs>()
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(()=>{
        inboxes.length == 0 && fetchInbox()
    }, [inboxes])

    const cancel = ()=>{
        setOpen(false)
        reset()
    }
    const send = async ({ inboxName, message }:Inputs) => {
        try{
            await sendMessageToContact(contact.id, inboxName, message)
            setOpen(false)
            reset()
            setOpenSnackbar({ status:true, msg:"Mensaje Enviado" })
        } catch(e){
            setOpenSnackbar({ status:true, msg:"Ha habido un error" })
        }
    }
    return (<>
        <button onClick={()=>setOpen(true)}><span>Enviar mensaje</span><span>&gt;</span></button>
        <Modal open={open} handleClose={() => setOpen(false)} size="lg" >
            <ModalHeader title={`Envíale un mensaje a ${contact.name}`} />
            <ModalBody>
                <form onSubmit={handleSubmit(send)}>
                    <Select control={control} label="Nombre del inbox" name="inboxName" >
                        {
                            inboxes.map(inbox => (
                                <Option 
                                    key={`inbox_option_${inbox.id}`} 
                                    value={inbox.name} 
                                    label={inbox.name?.toUpperCase()}
                                />
                            ))
                        }
                    </Select>
                    <Textarea 
                        name="message"
                        control={control}
                        label="Mensaje"
                    />
                    <button style={{ display:"none" }} ref={buttonRef}>Enviar</button>
                </form>
            </ModalBody>
            <ModalFooter>
                <ModalAction title='Enviar' onClick={()=>buttonRef.current?.click()}/>
                <ModalAction title='Cancelar' onClick={cancel} />
            </ModalFooter>
        </Modal>
        <Snackbar open={openSnackbar.status} handleClose={()=>setOpenSnackbar({ status:false, msg:""})}>
            Mensaje enviado
        </Snackbar>
    </>)
}