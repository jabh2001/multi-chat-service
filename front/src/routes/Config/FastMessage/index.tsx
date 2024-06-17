import { useMemo, useState } from "react";
import { useNavigate, type RouteObject } from "react-router-dom";
import { useFastMessage } from "../../../hooks/useFastMessage";
import FastMessageForm from "../../../components/form/FastMessageForm";
import FastMessageDetailPage from "./FastMessageDetailPage";
import { FastMessageType } from "../../../libs/schemas";
import { useDebounce } from "../../../hooks/useDebounce";
import HeaderSearchBar from "../../../components/HeaderSearchBar";
import LightingIcon from "../../../components/icons/LightingIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import PencilIcon from "../../../components/icons/PencilIcon";
import ConfirmTooltip from "../../../components/confirm-tooltip";

const baseName = "/config/fast-message"

const fastMessageRoute : RouteObject[] = [
    {
        path:baseName,
        element:<IndexPage />
    },
    {
        path:`${baseName}/:id`,
        element:<FastMessageDetailPage />
    }

];
function IndexPage(){
    const navigate = useNavigate()
    const [ filter, setFilter ] = useState("")
    const debounceFilter = useDebounce(filter)
    const {fastMessages:rawFastMessage, deleteFastMessage} = useFastMessage()

    const fastMessages = useMemo(() => rawFastMessage.filter(fastMessages => {
        return fastMessages.title.toLowerCase().includes(filter.toLowerCase()) || fastMessages.keyWords.toLowerCase().includes(filter.toLowerCase())
    } ), [debounceFilter, rawFastMessage])

    const handleDelete = ({ id }:FastMessageType) => deleteFastMessage(id)

    return (
    
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                <HeaderSearchBar placeholder="Search teams" value={filter} onChange={setFilter} onRemove={()=>setFilter("")} />
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
                                    <p className="font-medium">Nombre</p>
                                </div>
                                <div className="col-span-1 hidden items-center sm:flex">
                                    <p className="font-medium">Descripción</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Editar</p>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Eliminar</p>
                                </div>
                            </div>
                            <div className="max-h-[65vh] overflow-y-scroll">
                                {fastMessages.map((fast) => (
                                    <div className="grid grid-cols-4 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6" key={"label_" + fast.id} >
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {fast.title}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {fast.keyWords}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <button className="btn warning" onClick={() => navigate(`/config/fast-message/${fast.id}/`)}>
                                                <PencilIcon />
                                            </button>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <ConfirmTooltip onConfirm={() => handleDelete(fast)}>
                                                <button className="btn error">
                                                    <TrashIcon />
                                                </button>
                                            </ConfirmTooltip>
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
                        <LightingIcon />
                    </div>
                    <h3>Nuevo mensaje rápido</h3>
                </div>
                <div>
                    <FastMessageForm />
                </div>
            </div>
        </div>
    )
}

export default fastMessageRoute