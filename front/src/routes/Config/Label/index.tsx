import { useMemo, useState } from "react";
import { type RouteObject } from "react-router-dom";
import LabelForm from "../../../components/form/LabelForm";
import { useLabel } from "../../../hooks/useLabelStore";
import { useDebounce } from "../../../hooks/useDebounce";
import HeaderSearchBar from "../../../components/HeaderSearchBar";
import PencilIcon from "../../../components/icons/PencilIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import LabelIcon from "../../../components/icons/LabelIcon";
import { LabelType } from "../../../types";
import ConfirmTooltip from "../../../components/confirm-tooltip";

const baseName = "/config/labels"

const labelRoutes : RouteObject[] = [
    {
        
        path:baseName,
        element:<IndexPage />
    },

];

function IndexPage(){
    const [ filter, setFilter ] = useState("")
    const debounceFilter = useDebounce(filter)
    const { labels:rawLabels, deleteLabel } = useLabel()
    const [edited, setEdited] = useState<LabelType | undefined>(undefined)

    const labels = useMemo(() => rawLabels.filter(agent => {
        return agent.name.toLowerCase().includes(filter.toLowerCase())
    } ), [debounceFilter, rawLabels])
    const handleEdit = (row:LabelType) => {
        setEdited(row)
        
    }
    const handleDelete = ({ id }:LabelType) => deleteLabel(id)

    return (
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                <HeaderSearchBar placeholder="Search labels" value={filter} onChange={setFilter} onRemove={()=>setFilter("")} />
                <div>
                    <div className="flex justify-center pt-8">
                        <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                            <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                                <h4 className="text-xl font-semibold text-black">
                                    Lista de Etiquetas
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
                                {labels.map((label) => (
                                    <div className="grid grid-cols-4 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6" key={"label_" + label.id} >
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {label.name}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {label.description}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <button className="btn warning" onClick={() => handleEdit(label)}>
                                                <PencilIcon />
                                            </button>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <ConfirmTooltip onConfirm={() => handleDelete(label)}>
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
                        <LabelIcon />
                    </div>
                    <h3>Nueva etiqueta</h3>
                </div>
                <div>
                    <LabelForm edited={edited} resetEdited={()=>setEdited(undefined)} />
                </div>
            </div>
        </div>
    )
}

export default labelRoutes