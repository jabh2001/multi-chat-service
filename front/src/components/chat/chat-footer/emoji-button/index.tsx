import EmojiPicker from "emoji-picker-react"
import { useRef, useState } from "react"
import useClickOutside from "../../../../hooks/useClickOutside"

const EmojiButton = ({ onEmoji }:{ onEmoji?:(emoji:string) => void}) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const divRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)
    useClickOutside([buttonRef as any, divRef], () => setOpen(false))
    return <>
        <button ref={buttonRef} onClick={() => setOpen(!open)} type="button" className="absolute top-0 right-0 mt-2 mr-3 flex flex-shrink-0 focus:outline-none text-blue-600 hover:text-blue-700 w-6 h-6">
            <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.16 3a6 6 0 0 1-11.32 0h11.32z" />
            </svg>
        </button>
        <div ref={divRef} className="absolute bottom-20 right-0">
            <EmojiPicker onEmojiClick={data => {
                onEmoji && onEmoji(data.emoji)
            }} open={open} />
        </div>
    </>
}

export default EmojiButton