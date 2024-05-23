import { SocialMediaType } from "../../types"
import SocialMediaIcon from "../icons/SocialMediaIcon"
import styles from "./index.module.css"

type Props = {
    socialMedia:SocialMediaType
    size?: "sm" | "md" | "lg" | "xl" | "full"
}
export default function SocialMediaDisplay({ socialMedia, size="md" }:Props){
    const sizes = { sm:styles.sm, md:styles.md, lg:styles.lg, xl:styles.xl, full:styles.full };
    return (
        <a href={socialMedia.url} className={styles.container}>
            <span className={sizes[size]}>
                <SocialMediaIcon socialMedia={socialMedia.name} />
            </span>
            <div>{socialMedia.displayText}</div>
        </a>
    )
}