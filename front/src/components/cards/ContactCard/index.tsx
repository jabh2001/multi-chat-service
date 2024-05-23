import styles from "./index.module.css"
import CircleAvatar from "../../../components/avatar/CircleAvatar";
import SocialMediaDisplay from "../../../components/SocialMediaDisplay";
import { ContactType } from "../../../types";
import { Link } from "react-router-dom";

export default function ContactCard({ contact }:{ contact?:ContactType }){
    if(!contact){
        return <></>
    }
    return (
        <div className={styles.container}>
            <div className={styles.avatarContainer}>
                <CircleAvatar src={contact.avatarUrl} alt={contact.email} size="full" />
            </div>
            <div className={styles.contactData}>
                <div className={styles.nameInfo}>
                    <h3 className={styles.contactName}>{contact?.name}</h3>
                    <Link to={`/contacts/${contact.id}`}>
                        Edit
                    </Link>
                </div>
                {contact.email && <div>Correo electrónico: {contact.email}</div>}
                <div>Número de teléfono: {contact.phoneNumber}</div>
            </div>
                <div className={styles.socialMedia}>
                    {
                        contact.socialMedia?.length > 0 ? 
                        contact.socialMedia?.map(el => <SocialMediaDisplay key={`social_media_display_${el.id}`} socialMedia={el} /> ) : 
                        <p>Esta cuenta no tiene ninguna red social <Link to={`/contacts/${contact.id}`}>asigna una</Link></p>
                    }
                </div>
        </div>
    )
}