import { useEffect, useMemo, useState } from "react";
import { type RouteObject } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useSSE } from "../../../hooks/useSSE";
import useInboxStore from "../../../hooks/useInboxStore";
import TrashIcon from "../../../components/icons/TrashIcon";
import RightFromBracket from "../../../components/icons/RightFromBracket";
import EntradasIcon from "../../../components/icons/EntradasIcon";
import ViewIcon from "../../../components/icons/ViewIcon";
import SocialMediaIcon from "../../../components/icons/SocialMediaIcon";
import HeaderSearchBar from "../../../components/HeaderSearchBar";
import InboxForm from "../../../components/form/InboxForm";
import { deleteInbox, inboxLogout } from "../../../service/api";
import { InboxType } from "../../../types";
import { useDebounce } from "../../../hooks/useDebounce";

function IndexPage() {
    const [ filter, setFilter ] = useState("")
    const debounceFilter = useDebounce(filter)
    const rawInboxes = useInboxStore(state => state.inboxes)
    const updateInboxByName = useInboxStore(state => state.updateInboxByName)
    const fetchInboxes = useInboxStore(state => state.fetch)
    const deleteInboxS = useInboxStore(store => store.deleteInbox)
    const evtSrc = useSSE()

    const inboxes = useMemo(() => rawInboxes.filter(inbox => {
        return inbox.name.toLowerCase().includes(filter.toLowerCase())
    } ), [debounceFilter, rawInboxes])


    const handleDeleteConfirmation = async (inbox:InboxType) => {
        try {
            
            if(inbox.user) {
                await inboxLogout(inbox.id)
            } else {
                await deleteInbox(inbox.id)
                deleteInboxS(inbox.id)
            }
        } catch (e){

        }
    };
    useEffect(() => { fetchInboxes() }, [])

    useEffect(() => {
        if (evtSrc) {
            const func = (e: MessageEvent<any>) => {
                const inbox = JSON.parse(e.data)
                updateInboxByName(inbox)
            }
            evtSrc.addEventListener("qr-update", func)
            return () => evtSrc!.removeEventListener("qr", func)
        }
    }, [evtSrc])

    return (
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                <HeaderSearchBar placeholder="Search inbox" value={filter} onChange={setFilter} onRemove={()=>setFilter("")} />
                <div>
                    <div className="flex justify-center pt-8">
                        <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                            <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                                <h4 className="text-xl font-semibold text-black">
                                    Lista de mensajes rápidos
                                </h4>
                            </div>

                            <div className="grid grid-cols-4 border-b border-slate-300 py-4 px-4  md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Tipo</p>
                                </div>
                                <div className="col-span-1 hidden items-center sm:flex">
                                    <p className="font-medium">Nombre</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">ver</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">acción</p>
                                </div>
                            </div>
                            <div className="max-h-[65vh] overflow-y-scroll">
                                {inboxes.map((inbox) => (
                                    <div className="grid grid-cols-4 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6" key={"inbox_" + inbox.id} >
                                        <div className="col-span-1 items-center flex gap-2">
                                            <SocialMediaIcon socialMedia={inbox.channelType as any} className="w-8" />
                                            <p className="text-sm text-black">
                                                {inbox.channelType}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {inbox.name}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <Popup
                                                trigger={
                                                    <button className="btn warning sm">
                                                        <ViewIcon className="w-8" />
                                                    </button>
                                                }
                                                on={"hover"}
                                                position={"right center"}
                                            >
                                                {
                                                    ["whatsapp"].includes(inbox.channelType) ? (
                                                        <div className="w-96 relative">
                                                            {inbox.user && <div className="absolute top-0 left-0 w-full h-full bg-green-400/50"></div>}
                                                            <img className="w-full h-full object-contain" src={`data:image/png;base64,${inbox.qr}`} alt="" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 flex justify-center items-center">
                                                            {
                                                                inbox.user ? <p className="btn success sm">On</p> : <p className="btn error sm">Off</p>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </Popup>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <Popup
                                                trigger={
                                                    inbox.user ? (
                                                        <button className="btn error">
                                                            <RightFromBracket />
                                                        </button>
                                                    ) : (
                                                        <button className="btn error">
                                                            <TrashIcon />
                                                        </button>
                                                    )
                                                }
                                                position={"top center"}
                                            >
                                                <div className="flex flex-col items-center gap-2 text-gray-600 p-2">
                                                    <p className="text-center">¿Estas seguro de realizar esta acción? es irreversible</p>
                                                    <button className="btn error link" onClick={() => handleDeleteConfirmation(inbox)}>Estoy seguro</button>
                                                </div>
                                            </Popup>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="bg-white border-gray-200 p-4 border-l-2">
                <div className="flex justify-start items-center gap-4 text-primary fill-primary text-xl font-bold mb-4 ">
                    <div>
                        <EntradasIcon />
                    </div>
                    <h3>Nuevo mensaje rápido</h3>
                </div>
                <div>
                    <InboxForm />
                </div>
            </div>
        </div>
    )
}
const baseName = "/config/inboxes"
const inboxesRoutes: RouteObject[] = [
    {
        path: baseName,
        element: <IndexPage />
    },
];
export default inboxesRoutes