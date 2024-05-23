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
}
export default function SocialMediaIcon({ socialMedia }:Props){
    switch(socialMedia){
        case "facebook":  return <FaceBookIcon />;
        case "gmail":     return <GmailIcon />;
        case "instagram": return <InstagramIcon />;
        case "whatsapp":  return <WhatsAppIcon />;
        case "telegram":  return <TelegramIcon />;
        case "linkedin":  return <LinkedInIcon />;
        case "threads":   return <ThreadsIcon />;
        default: return null
    }
}