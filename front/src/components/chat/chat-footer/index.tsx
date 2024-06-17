import { useEffect, useRef, useState } from "react"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import useMessageForm from "../../../hooks/useMessageForm"
import useMessageMedia from "../../../hooks/useMessageMedia";
import { useFastMessage } from "../../../hooks/useFastMessage";
import { useDebounce } from "../../../hooks/useDebounce";
import LightingIcon from "../../../components/icons/LightingIcon";
import { FastMessageType } from "../../../libs/schemas";
import PhotoButton from "./photo-button";
import CameraButton from "./camara-button";
import MicrophoneButton from "./microphone-button";
import EmojiButton from "./emoji-button";
import HeaderSearchBar from "../../../components/HeaderSearchBar";

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
                <MicrophoneButton />
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

            <div>
                <HeaderSearchBar placeholder="Search fast message" value={search} onChange={setSearch} onRemove={()=>setSearch("")} />
                <div className="flex justify-center py-8">
                    <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                        <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                            <h4 className="text-xl font-semibold text-black">
                                Lista de agentes
                            </h4>
                        </div>

                        <div className="grid grid-cols-3 border-b border-slate-300 py-4 px-4  md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Nombre</p>
                            </div>
                            <div className="col-span-1 hidden items-center sm:flex">
                                <p className="font-medium">Correo</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium">Tipo</p>
                            </div>
                        </div>
                        <div className="max-h-[65vh] overflow-y-scroll">
                            {filteredFastMessages.map((f) => (
                                <div
                                    className="grid grid-cols-6 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6"
                                    key={`fastMessageModalButton-${f.id}`}
                                >
                                    <div className="col-span-1 items-center flex">
                                        <p className="text-sm text-black">
                                            {f.title}
                                        </p>
                                    </div>
                                    <div className="col-span-1 items-center flex">
                                        <p className="text-sm text-black">
                                            {f.keyWords}
                                        </p>
                                    </div>
                                    <div className="col-span-1 items-center flex">
                                        <button  onClick={() => handleClick(f)} type="button" className="btn primary">Seleccionar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    )
}