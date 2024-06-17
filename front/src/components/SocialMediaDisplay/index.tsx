import { SocialMediaType } from "../../types"
import SocialMediaIcon from "../icons/SocialMediaIcon"

type Props = {
    socialMedia:SocialMediaType
    size?: "sm" | "md" | "lg" | "xl" | "full"
}
export default function SocialMediaDisplay({ socialMedia, size="md" }:Props){
    const sizes = { sm:"w-4", md:"w-8", lg:"w-12", xl:"w-16", full:"w-full" };
    return (
        <a href={socialMedia.url} className={"flex flex-col justify-center items-center min-w-[50px]"}>
            <span className={sizes[size]}>
                <SocialMediaIcon className="w-full" socialMedia={socialMedia.name} />
            </span>
            <p>{socialMedia.displayText}</p>
        </a>
    )
}