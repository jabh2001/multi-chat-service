import { useEffect, useRef, useState } from "react"
import EmojiPicker from "emoji-picker-react"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import useClickOutside from "../../../hooks/useClickOutside"
import useMessageForm from "../../../hooks/useMessageForm"
import useMessageMedia from "../../../hooks/useMessageMedia";
import useCamera from "../../../hooks/useCamera";
import { useFastMessage } from "../../../hooks/useFastMessage";
import { useDebounce } from "../../../hooks/useDebounce";
import LightingIcon from "../../../components/icons/LightingIcon";
import { FastMessageType } from "../../../libs/schemas";

export default function ChatFooter(){
    const formRef = useRef<HTMLFormElement>(null)
    const files = useMessageMedia(state => state.files)
    const dFiles = useDebounce(files)
    const { handleSubmit, message, setMessage, handleSendFastMessage } = useMessageForm()
    
    useEffect(() => {
        if(files.length > 0) {
            const button:HTMLButtonElement | null | undefined = formRef.current?.querySelector("input[type=submit]")
            button?.click()
        }
    }, [dFiles])

    const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault()
            const button:HTMLButtonElement | null | undefined = formRef.current?.querySelector("input[type=submit]")
            button?.click()
        } 
    }
    return (
        <form className="chat-footer flex-none" ref={formRef} onSubmit={handleSubmit}>
            <div className="flex flex-row items-center p-4">
                <MoreButton sendFastMessage={ f => handleSendFastMessage(f.id)} />
                <PhotoButton />
                <CameraButton />
                {/* <MicrophoneButton /> */}
                <div className="relative flex-grow">
                    <label>
                        <input 
                            className="rounded-full py-2 pl-3 pr-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                            type="text"
                            value={message}
                            onChange={evt => setMessage(evt.target.value)}
                            placeholder="Aa"
                            onKeyDown={handleKeyDown}
                        />
                        <EmojiButton onEmoji={emoji => setMessage(msg => msg+emoji)} />
                    </label>
                </div>
            </div>
            <input type="submit" className="hidden"></input>
        </form>
    )
}

const MoreButton = ({ sendFastMessage }:{ sendFastMessage:(fastMessage:FastMessageType) => void}) => (
    <Popup trigger={(
        <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6">
            <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                <path d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M15,11h-4v4H9  v-4H5V9h4V5h2v4h4V11z"/>
            </svg>
        </button>
        )}
        position="top center"
        contentStyle={{ background:"hsl(222.2, 92%, 4.9%)", minWidth:"250px", border:"none", paddingBlock:16}}
        nested
    >
        <MenuFastMessageInputOption onSelectMessage={sendFastMessage} />
    </Popup>
)
const PhotoButton = () => {
    const appendFile = useMessageMedia(state => state.appendFile)
    const input = useRef<HTMLInputElement>(null)

    return (
        <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6" onClick={()=>input.current?.click()}>
            <input
                type="file" 
                className="hidden" 
                ref={input} 
                multiple 
                // accept="image/jpeg"
                onChange={e => {
                    if(!e.target.files){
                        return null
                    }
                    for(const f of e.target.files){
                        appendFile(f)
                    }
                }}
            />
            <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                <path d="M11,13 L8,10 L2,16 L11,16 L18,16 L13,11 L11,13 Z M0,3.99406028 C0,2.8927712 0.898212381,2 1.99079514,2 L18.0092049,2 C19.1086907,2 20,2.89451376 20,3.99406028 L20,16.0059397 C20,17.1072288 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M15,9 C16.1045695,9 17,8.1045695 17,7 C17,5.8954305 16.1045695,5 15,5 C13.8954305,5 13,5.8954305 13,7 C13,8.1045695 13.8954305,9 15,9 Z" />
            </svg>
        </button>
    )
}
const CameraButton = () => {
    const ref = useRef<HTMLVideoElement>(document.createElement("video"))
    const appendFile = useMessageMedia(state => state.appendFile)
    const { start, stop, shot, getFile } = useCamera({ target:ref.current})
    const handleClick = () => {
        start()
    }
    const handleClose = () => {
        stop()
    }
    const handleShot = () => {
        shot()
        appendFile(getFile())
        stop()
    }

    return (
        <Popup trigger={(
            <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6">
                <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                    <path d="M0,6.00585866 C0,4.89805351 0.893899798,4 2.0048815,4 L5,4 L7,2 L13,2 L15,4 L17.9951185,4 C19.102384,4 20,4.89706013 20,6.00585866 L20,15.9941413 C20,17.1019465 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1029399 0,15.9941413 L0,6.00585866 Z M10,16 C12.7614237,16 15,13.7614237 15,11 C15,8.23857625 12.7614237,6 10,6 C7.23857625,6 5,8.23857625 5,11 C5,13.7614237 7.23857625,16 10,16 Z M10,14 C11.6568542,14 13,12.6568542 13,11 C13,9.34314575 11.6568542,8 10,8 C8.34314575,8 7,9.34314575 7,11 C7,12.6568542 8.34314575,14 10,14 Z"/>
                </svg>
            </button>
            )}
            modal
            onOpen={handleClick}
            onClose={handleClose}
            className="relative"
        >
                <video className="w-full h-full object-contain" ref={ref}></video>
                <button type="button" className="btn primary absolute bottom-10 right-10" onClick={handleShot}>enviar</button>
        </Popup>
    )
}
const MicrophoneButton = () => (
    <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6">
        <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
            <path d="M9,18 L9,16.9379599 C5.05368842,16.4447356 2,13.0713165 2,9 L4,9 L4,9.00181488 C4,12.3172241 6.6862915,15 10,15 C13.3069658,15 16,12.314521 16,9.00181488 L16,9 L18,9 C18,13.0790094 14.9395595,16.4450043 11,16.9378859 L11,18 L14,18 L14,20 L6,20 L6,18 L9,18 L9,18 Z M6,4.00650452 C6,1.79377317 7.79535615,0 10,0 C12.209139,0 14,1.79394555 14,4.00650452 L14,8.99349548 C14,11.2062268 12.2046438,13 10,13 C7.790861,13 6,11.2060545 6,8.99349548 L6,4.00650452 L6,4.00650452 Z" />
        </svg>
    </button>
)
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


function MenuFastMessageInputOption({ onSelectMessage }:{ onSelectMessage:(fastMessage:FastMessageType) => void}){
    const [search, setSearch] = useState("")
    const { fastMessages } = useFastMessage()
    const debounceSearch = useDebounce(search, 500)
    const filteredFastMessages = fastMessages.filter(fastMessage => {
        return debounceSearch === "" || (
            fastMessage.title.toLowerCase().includes(debounceSearch.toLowerCase()) || 
            fastMessage.keyWords.toLowerCase().includes(debounceSearch.toLowerCase())
        )
    })
    const handleClick = (fastMessage:FastMessageType) => {
        onSelectMessage(fastMessage)
    }
    
    return (
        <Popup trigger={(
            <button className="btn primary">
                <LightingIcon />
                Mensajes rápidos
            </button>
            )}
            modal
            className="relative"
            nested
        >
            <div className="text-black p-8">

                <div>
                    <div className="grid grid-cols-3">
                        <div className="flex items-center justify-center p-2">Título</div>
                        <div className="flex items-center justify-center p-2">Descripción</div>
                        <div className="flex items-center justify-center p-2">Acción</div>

                    </div>
                </div>
                <div>
                        {
                            filteredFastMessages.map(f => (
                                <div className="grid grid-cols-2" key={`fastMessageModalButton-${f.id}`}>
                                    <div className="flex items-center justify-center p-2">{f.title}</div>
                                    <div className="flex items-center justify-center p-2">{f.keyWords}</div>
                                    <div className="flex items-center justify-center p-2">
                                        <button  onClick={() => handleClick(f)} type="button" className="btn primary">Seleccionar</button>
                                    </div>
                                </div>
                            ) )
                        }
                </div>
            </div>
        </Popup>
    )
}