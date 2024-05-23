import { useForm } from "react-hook-form"
import useSnackbar from "../../../hooks/useSnackbar"
import NormalInput from "../inputs/NormalInput"
import { saveNewConversationNote, updateConversationNote } from "../../../service/api"
import { ConversationType, UserType } from "../../../types"
import { ConversationNoteType } from "../../../libs/schemas"
import { AxiosError } from "axios"
import Snackbar from "../../Snackbar"
import Checkbox from "../inputs/Checkbox"
import { useEffect } from "react"

type Props = {
    conversation:ConversationType
    user:UserType
    editNote?:ConversationNoteType
    onAdd?:(note:ConversationNoteType) => void
    onEdit?:(note:ConversationNoteType) => void
}
export default function ConversationNoteForm({ conversation, user, editNote, onAdd, onEdit }:Props){
    const { open, handleClose, message, success, error } = useSnackbar()
    const { control, handleSubmit, setValue, reset } = useForm<{ content:string, important:boolean}>()
    useEffect(() => {
        if(editNote){
            const  {content, important} = editNote
            setValue("content", content)
            setValue("important", important)
        }
    }, [editNote])
    return (
        
        <form style={{ display: "flex", alignItems:"center", gap:8, background:"#fffa" }} onSubmit={handleSubmit(async data => {
            try{
                if(editNote === undefined){
                    const note = await saveNewConversationNote(conversation.inboxId, conversation.id, {...data, userId:user.id, conversationId:conversation.id})
                    onAdd && onAdd(note)
                    success("Se ha añadido una nueva nota")
                } else {
                    const note = await updateConversationNote(conversation.inboxId, conversation.id, editNote.id, { ...data })
                    onEdit && onEdit(note)
                    success("Se ha editado una nota")
                }
                reset()
            } catch (e:any){
                if(e instanceof AxiosError){
                    error(e.response?.data)
                } else {
                    error(e.message)
                }
            }
        })}>
            <NormalInput name="content" control={control} label="Contenido" />
            <Checkbox name="important" control={control} label="Importante" />
            <button className="btn primary" type="submit">Guardar</button>
            <Snackbar open={open} handleClose={handleClose}>
                {
                    message.map(m => (
                        <p key={m}>{m}</p>
                    ))
                }
            </Snackbar>
        </form>
    )
}