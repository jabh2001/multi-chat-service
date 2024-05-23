import { useForm } from "react-hook-form"
import { SocialMediaType } from "../../../types"
import { useEffect } from "react"
import styles from "./index.module.css"
import { postSocialMedia, putSocialMedia } from "../../../service/api"
import { useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { socialMediaSchema } from "../../../libs/schemas"
import NormalInput from "../inputs/NormalInput"

type Props = {
    edited?:SocialMediaType
    onEdit?:(socialMedia:SocialMediaType) => void
    onAdd?:(socialMedia:SocialMediaType) => void
}
type Inputs = {
    name: SocialMediaType["name"]
    url: SocialMediaType["url"]
    displayText: SocialMediaType["displayText"]
}

type Keys = "name" | "url" | "displayText"

export default function SocialMediaForm({ edited, onEdit, onAdd }:Props){
    const { contactId } = useParams()
    const { register, handleSubmit, setValue, reset, formState:{ errors }, control } = useForm<Inputs>({ resolver:zodResolver(socialMediaSchema.omit({ id:true, contactId:true })) })
    useEffect(()=> {
        if(edited){
            for (const key of Object.keys(edited)) {
                if(["name", "url", "displayText"].includes(key)){
                    const KEY = key as Keys
                    setValue(KEY, edited[KEY])
                }
                
            }
        }
    }, [edited])

    return (
        <form className={`${styles.form} ${!edited && styles.newS}`} onSubmit={handleSubmit(async (data)=>{
            if(edited){
                const socialMedia = await putSocialMedia(Number(contactId), edited.id, data)
                onEdit && onEdit({ ...socialMedia })
            } else {
                const socialMedia = await postSocialMedia(Number(contactId), data)
                onAdd && onAdd(socialMedia)
            }
            reset()
        })}>
            <label className="input">
                <span>Red social</span>
                <select {...register("name")}>
                    <option disabled>Selecciona</option>
                    <option value="facebook">Facebook</option>
                    <option value="gmail">Gmail</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">Whatsapp</option>
                    <option value="telegram">Telegram</option>
                    <option value="linkedin">Linkedin</option>
                    <option value="threads">Threads</option>
                </select>
                { errors.name && <p className="error">{errors.name.message}</p> }
            </label>
            <div>
                <NormalInput name="url" control={control} label="Link" />
            </div>
            <div>
                <NormalInput name="displayText" control={control} label="Nombre" />
            </div>
            <div>
                <button className="btn primary">Guardar</button>
            </div>
        </form>
    )
}