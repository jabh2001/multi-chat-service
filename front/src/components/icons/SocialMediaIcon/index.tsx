import FaceBookIcon from "./FacebookIcon"
import GmailIcon from "./GmailIcon"
import InstagramIcon from "./InstagramIcon"
import WhatsAppIcon from "./WhatsAppIcon"
import TelegramIcon from "./TelegramIcon"
import LinkedInIcon from "./LinkedInIcon"
import ThreadsIcon from "./ThreadsIcon"
import { SocialMediaType } from "../../../types"

type Props = {
    socialMedia: SocialMediaType["name"]
    className?:string
}
export default function SocialMediaIcon({ socialMedia, className }:Props){
    switch(socialMedia){
        case "facebook":  return <FaceBookIcon className={className} />;
        case "gmail":     return <GmailIcon className={className} />;
        case "instagram": return <InstagramIcon className={className} />;
        case "whatsapp":  return <WhatsAppIcon className={className} />;
        case "telegram":  return <TelegramIcon className={className} />;
        case "linkedin":  return <LinkedInIcon className={className} />;
        case "threads":   return <ThreadsIcon className={className} />;
        default: return null
    }
}