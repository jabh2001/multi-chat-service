import { useEffect, useState } from "react";
import Drawer from "../../components/Drawer";
// import styles from "./index.module.css"
import { ContactType } from "../../types";
import { getContactById } from "../../service/api";

type Props = {
    contactId:number | string | undefined | null
    onClose?:()=>void
}
export default function ViewContact({ contactId, onClose }:Props){
    const [open, setOpen] = useState(true)
    const [contactInfo, setContactInfo] = useState<ContactType>()

    useEffect(()=>{
        const getData = async ()=>{
            if(!contactId) return
            const contact = await getContactById(Number(contactId))
            setContactInfo(contact)
        }
        const prevTitle = document.title
        if(contactId){
            setOpen(true)
            document.title = `Viewing ${contactId}`
            getData()
        }
        return () => {
            document.title = prevTitle
        }
    }, [contactId])
    useEffect(()=>{
        console.log(contactInfo)
    }, [contactInfo])

    const handleClose = () => {
        setOpen(false)
        onClose && onClose()
    }
    return (
        <Drawer open={open} onClose={handleClose}>
            {contactInfo && (
                <div>
                    
                </div>
            )}
        </Drawer>
    )
}