import { useForm } from "react-hook-form"
import { ContactType } from "../../../types"
import { useEffect } from "react"
import { postContact, putContact } from "../../../service/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema } from "../../../libs/schemas"
import NormalInput from "../inputs/NormalInput"
import styles from "./contactForm.module.css"
import FileInput from "../inputs/FileInput"
import { z } from "zod"
import { convertBase64ToImgString, convertFileToBase64 } from "../../../service/file"
import PhoneNumberInput from "../inputs/PhoneNumberInput"
import useSnackbar from "../../../hooks/useSnackbar"
import Snackbar from "../../Snackbar"
import { AxiosError } from "axios"
import AgentProtection from "../AgentProtection"

type Props = {
    edited?: ContactType
    onEdit?: (contact: ContactType) => void
    onAdd?: (contact: ContactType) => void
}
type Inputs = {
    name: ContactType["name"]
    email: ContactType["email"]
    phoneNumber: ContactType["phoneNumber"]
    countryCode: string
    picture: File
}

type Keys = "name" | "email" | "phoneNumber" 
const schemaResolver = contactSchema.partial({ email:true }).omit({ id: true, avatarUrl: true }).extend({ picture: z.any() })
const resolver = zodResolver(schemaResolver)

export default function ContactEditForm({ edited, onEdit, onAdd }: Props) {
    const { control, handleSubmit, setValue, reset } = useForm<Inputs>({ resolver })
    const { open, handleClose, message, success, error} = useSnackbar()

    useEffect(() => {
        if (edited !== undefined) {
            for (const key of Object.keys(edited)) {
                if (["name", "email", "phoneNumber", ].includes(key)) {
                    const KEY = key as Keys
                    setValue(KEY, edited[KEY] ?? "")
                }
            }
        } else {
            reset()
        }
    }, [edited])
    return (
        <form className={styles.form} onSubmit={handleSubmit(async ({ picture, countryCode,...data }) => {
            try {
                if (edited) {
                    const contact = await putContact(edited.id, { ...data, picture: await convertFileToBase64(picture) })
                    onEdit && onEdit(contact)
                    reset()
                } else {
                    const contact = await postContact({...data, picture:await convertFileToBase64(picture)})
                    onAdd && onAdd({...contact, avatarUrl:convertBase64ToImgString(contact.avatarUrl)})
                    reset()
                }
                success("Contacto registrado")
            } catch (e:any){
                if(e instanceof AxiosError){
                    error(e.response?.data)
                } else {
                    error(e.message)
                }
            }
        })}>
            <AgentProtection >
            <NormalInput control={control} name="name" label="Nombre" />
            <NormalInput control={control} name="email" label="Correo" />
            <PhoneNumberInput control={control} name="phoneNumber" label="Número de teléfono" />

            <FileInput accept="image/png" control={control} name="picture" label="Imagen" />
            <div>
                <button className="btn primary">Guardar</button>

            </div>
            <Snackbar open={open} handleClose={handleClose}>
                {
                    message.map(m => (
                        <p key={m}>{m}</p>
                    ))
                }
            </Snackbar>
            </AgentProtection>
        </form>
    )
}