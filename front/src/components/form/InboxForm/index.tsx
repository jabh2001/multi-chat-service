import { useState } from "react";
import { useForm } from "react-hook-form";
import SocialMediaIcon from "../../icons/SocialMediaIcon";
import NormalInput from "../inputs/NormalInput";
import { postInbox } from "../../../service/api";
import useInboxStore from "../../../hooks/useInboxStore";

export default function InboxForm(){
    const addInbox = useInboxStore(store => store.addInbox)
    const [ channel, setChannel ] = useState<string>("")
    const handleAddInbox = (newInbox:any) => {
        addInbox(newInbox)
        setChannel("")
    }
    return (
        <div>
            {/* <p className="text-gray-800">
                las entradas son las conexiones disponibles que tendrás a la distinta plataforma Ponle un nombre único que te permita reconocer desde qué dispositivo o
                plataforma estás enviando los mensajes al estar conectada todos los mensajes Que recibas a esto esta plataforma serán redirigidas a tu buzón de mensaje 
                del sistema esto también te permitirá responder  mensajes desde dicha plataforma los mensajes que lleguen de contactos no registrados serán guardados 
                automáticamente con el nombre que brinde esta plataforma para ese contacto
            </p> */}
            <div className="flex justify-center pt-8">
                <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                    <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                        <h4 className="text-xl font-semibold text-black">
                            Lista de canales disponibles
                        </h4>
                    </div>

                    <div className="grid grid-cols-3 border-b border-slate-300 py-4 px-4  md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                        <div className="col-span-2 flex items-center">
                            <p className="font-medium">Canal</p>
                        </div>
                        <div className="col-span-1 hidden items-center sm:flex">
                            <p className="font-medium">acción</p>
                        </div>
                    </div>
                    <div className="max-h-[50vh] overflow-y-scroll">
                        <div className="grid grid-cols-3 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6">
                            <div className="col-span-2 items-center flex gap-2">
                                <SocialMediaIcon socialMedia="whatsapp" className="w-8" />
                                <p className="text-sm text-black">
                                    Whatsapp
                                </p>
                            </div>
                            <div className="col-span-1 items-center flex">
                                <button className="btn success link" onClick={() => setChannel("whatsapp")}>
                                    crear
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6">
                            <div className="col-span-2 items-center flex gap-2">
                                <SocialMediaIcon socialMedia="telegram" className="w-8" />
                                <p className="text-sm text-black">
                                    Telegram
                                </p>
                            </div>
                            <div className="col-span-1 items-center flex">
                                <button className="btn primary link" onClick={() => setChannel("telegram")}>
                                    crear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 mt-8 border-gray-200 border-t-2">
                {
                    channel === "whatsapp" ? <WhatsAppForm onSubmit={handleAddInbox} /> :
                    channel === "telegram" ? <TelegramForm onSubmit={handleAddInbox} /> :
                    null
                }
            </div>
        </div>
    )
}
function WhatsAppForm({ onSubmit, onError }:{ onSubmit?:(inbox:any) => void, onError?:(inbox:any) => void }){
    const { control, handleSubmit, reset } = useForm<{ name:string }>()
    return (
        <form onSubmit={handleSubmit(async ({ name }) => {
            try {
                onSubmit && onSubmit(await postInbox({name, channelType:"whatsapp"}))
            } catch (e) {
                onError && onError(e)
            } finally {
                reset()
            }
        })}>
            <div className="flex flex-col gap-4">
                <NormalInput control={control} name="name" fullWidth label="Nombre  del canal" />
                <button className="btn success" type="submit">Guardar</button>
            </div>
        </form>
    )
}

function TelegramForm({ onSubmit, onError }:{ onSubmit?:(inbox:any) => void, onError?:(inbox:any) => void }){
    const { control, handleSubmit, reset } = useForm<{ name:string, telegramToken:string }>()
    return (
        <form onSubmit={handleSubmit(async ({ name, telegramToken }) => {
            try {
                onSubmit && onSubmit(await postInbox({name, telegramToken, channelType:"telegram"}))
            } catch (e) {
                onError && onError(e)
            } finally {
                reset()
            }
        })}>
            <div className="flex flex-col gap-4">
                <NormalInput control={control} name="name" fullWidth label="Nombre  del canal" />
                <NormalInput control={control} name="telegramToken" fullWidth label="Token del bot de telegram" />
                <button className="btn primary" type="submit">Guardar</button>
            </div>
        </form>
    )
}