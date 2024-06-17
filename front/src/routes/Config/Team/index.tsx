import { type RouteObject } from "react-router-dom";
import TeamForm from "../../../components/form/TeamForm";
import { useTeam } from "../../../hooks/useTeamStore";
import { useMemo, useState } from "react";
import { TeamType } from "../../../types";
import HeaderSearchBar from "../../../components/HeaderSearchBar";
import { useDebounce } from "../../../hooks/useDebounce";
import PencilIcon from "../../../components/icons/PencilIcon";
import TrashIcon from "../../../components/icons/TrashIcon";
import LabelIcon from "../../../components/icons/LabelIcon";
import ConfirmTooltip from "../../../components/confirm-tooltip";

const baseName = "/config/teams"

const teamRoutes : RouteObject[] = [
    {
        
        path:baseName,
        element:<IndexPage />
    },

];
// function useTabulatorFilter

function IndexPage(){
    const [ filter, setFilter ] = useState("")
    const debounceFilter = useDebounce(filter)
    const { teams:rawTeams, deleteTeam } = useTeam()
    const [edited, setEdited] = useState<TeamType | undefined>(undefined)

    const teams = useMemo(() => rawTeams.filter(agent => {
        return agent.name.toLowerCase().includes(filter.toLowerCase())
    } ), [debounceFilter, rawTeams])

    const handleEdit = (row:TeamType) => setEdited(row)
    const handleDelete = ({ id }:TeamType) => deleteTeam(id)

    return (
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                <HeaderSearchBar placeholder="Search teams" value={filter} onChange={setFilter} onRemove={()=>setFilter("")} />
                <div>
                    <div className="flex justify-center pt-8">
                        <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                            <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                                <h4 className="text-xl font-semibold text-black">
                                    Lista de equipos
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
                                {teams.map((team) => (
                                    <div className="grid grid-cols-4 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6" key={"team_" + team.id} >
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {team.name}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {team.description}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <button className="btn warning" onClick={() => handleEdit(team)}>
                                                <PencilIcon />
                                            </button>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <ConfirmTooltip onConfirm={() => handleDelete(team)}>
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
                    <h3>Nuevo equipo</h3>
                </div>
                <div>
                    <TeamForm edited={edited} resetEdited={()=>setEdited(undefined)} />
                </div>
            </div>
        </div>
    )
}

export default teamRoutes