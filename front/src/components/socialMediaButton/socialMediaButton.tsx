import { FC } from "react"
import './socialMediaButton.css'
interface socialMediaButtonProps {
    logo: string
}

export const SocialMediaButtons: FC<socialMediaButtonProps> = (props: socialMediaButtonProps) => {
    const { logo } = props
    return <div className="socialMediaButton">

        <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" dangerouslySetInnerHTML={{ __html: logo }} />

        </button>
    </div>
} 