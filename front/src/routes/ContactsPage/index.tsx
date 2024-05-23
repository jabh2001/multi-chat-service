import { useEffect, useState } from "react"
import SearchBar from "../../components/SearchBar"
import { PhoneIcon } from "../../components/icons"
import { type ContactType } from "../../types"
import { getContacts } from "../../service/api"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ReactTabulator } from "react-tabulator"
import styles from "./index.module.css"
import ContactEditForm from "../../components/form/ContactForm"

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
        <div className={styles.container}>
            <div className={styles.tablePanel}>
                <div className={styles.searchBar}>
                    <h3>Contacts</h3>
                    <SearchBar placeholder="Search contact..." />
                    <button className="btn secondary">Filtrar</button>
                </div>
                <div className={styles.tableContainer}>
                  <div>
                    <ReactTabulator
                        options={{
                            pagination:true,
                            paginationSize:10
                        }}
                        columns={[
                            {title:"Ver", field:"id", formatter:"handle", width:50, cellClick:(_evt, cell) => navigate(`${cell.getValue()}`)},
                            {field:"name", title:"Nombre"},
                            {field:"email", title:"Correo"},
                            {field:"phoneNumber", title:"Teléfono"},
                            {field:"avatarUrl", title:"Imagen", formatter:"image", formatterParams:{
                                height:"50px",
                                width:"50px",
                            }},
                        ]}
                        data={contacts}
                    />
                  </div>
                </div>
            </div>
            <div className={styles.sidePanel}>
                <div className={styles.title}>
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