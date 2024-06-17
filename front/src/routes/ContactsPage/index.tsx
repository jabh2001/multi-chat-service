import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PhoneIcon } from "../../components/icons"
import ContactEditForm from "../../components/form/ContactForm"
import HeaderSearchBar from "../../components/HeaderSearchBar"
import { getContacts } from "../../service/api"
import { type ContactType } from "../../types"

export default function ContactsPage(){
    const [searchParams] = useSearchParams()
    const [contacts, setContacts ] = useState<ContactType[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        const data = async ()=>{
            const contacts = await getContacts(Number(searchParams.get("label")) ?? undefined)
            setContacts(contacts)
        }
        data()
    }, [searchParams])

    return (
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                <HeaderSearchBar placeholder="Search contact" />
                <div className="flex justify-center pt-8">
                    <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                        <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                            <h4 className="text-xl font-semibold text-black">
                                Lista de contactos
                            </h4>
                        </div>

                        <div className="grid grid-cols-6 border-b border-slate-300 py-4 px-4 sm:grid-cols-8 md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                            <div className="col-span-3 flex items-center">
                                <p className="font-medium">Nombre</p>
                            </div>
                            <div className="col-span-2 hidden items-center sm:flex">
                                <p className="font-medium">Teléfono</p>
                            </div>
                            <div className="col-span-1 flex items-center">
                                <p className="font-medium"> </p>
                            </div>
                        </div>
                        <div className="max-h-[65vh] overflow-y-scroll">
                            {contacts.map(({ id, name, phoneNumber, avatarUrl }) => (
                                <div
                                    className="grid grid-cols-6 border-b border-slate-300 py-4 px-4 sm:grid-cols-8 md:px-6 2xl:px-6"
                                    key={"contact_" + id}
                                >
                                    <div className="col-span-3 flex items-center">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            <div className="h-16 w-16 rounded-md">
                                                <img src={avatarUrl} alt="Product" className="rounded-full" />
                                            </div>
                                            <p className="text-sm text-black">
                                                {name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 hidden items-center sm:flex">
                                        <p className="text-sm text-black">
                                            {phoneNumber}
                                        </p>
                                    </div>
                                    <div className="col-span-2 hidden items-center justify-self-center sm:flex">
                                        <button className="btn primary" onClick={() => navigate("id")}>
                                            Ver perfil  
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white border-gray-200 border-l-2">
                <div className="flex justify-start items-center gap-4 p-4 text-primary fill-primary text-xl font-bold ">
                    <div>
                        <PhoneIcon />
                    </div>
                    <h3>Nuevo Contacto</h3>
                </div>
                <div>
                    <ContactEditForm onAdd={contact => setContacts(contacts => [...contacts, contact])}/>
                </div>
            </div>
        </div>
    )
}