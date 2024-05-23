import { useEffect, useState } from "react"
import { useConversationStore } from "../../hooks/useConversations"
import { ConversationNoteType } from "../../libs/schemas"
import useAuth from "../../hooks/useAuth"
import ConversationNoteForm from "../form/ConversationNoteForm"
import { deleteConversationNote, getConversationNotes } from "../../service/api"
import styles from "./index.module.css"
import TrashIcon from "../icons/TrashIcon"
import PencilIcon from "../icons/PencilIcon"
import { AxiosError } from "axios"
import useSnackbar from "../../hooks/useSnackbar"
import Snackbar from "../Snackbar"

export default function NoteList(){
    const { open, handleClose, message, success, error } = useSnackbar()
    const conversation = useConversationStore(store => store.conversation)
    const user = useAuth(store => store.user)
    const [notes, setNotes] = useState<ConversationNoteType[]>([])
    const [ editNote, setEditNote] = useState<ConversationNoteType>()
    if(!conversation || !user){
        return null
    }
    useEffect(()=> {
        if(conversation && user){
            getConversationNotes(conversation.inboxId, conversation.id).then(setNotes)
        }
    }, [conversation, user])
    const handleDelete = async (note:ConversationNoteType) => {
        if(notes.includes(note)){
            try{

                const deletedNote = await deleteConversationNote(conversation.inboxId, conversation.id, note.id)
                setNotes(notes.filter((n)=> n.id !== deletedNote.id))
                success("")
            } catch (e:any){
                if(e instanceof AxiosError){
                    error(e.response?.data)
                } else {
                    error(e.message)
                }
            }
        }
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.notes}>
                {
                    notes.map(note => (
                        <div key={note.id} className={`${styles.note} ${note.important && styles.important}`}>
                            <p>{note.content}</p>
                            <span className={styles.separated}></span>
                            <button className={styles.trash} onClick={() => handleDelete(note)}>
                                <TrashIcon />
                            </button>
                            <button className={styles.pencil} onClick={() => setEditNote(note)}>
                                <PencilIcon />
                            </button>
                        </div>
                    ))
                }
            </div>
            <ConversationNoteForm 
                conversation={conversation} 
                user={user} 
                editNote={editNote}
                onAdd={note => {
                    setNotes([...notes, note])
                }} 
                onEdit={note => {
                    setNotes(notes.map(n => n.id === note.id ? {...n,  ...note} : n))
                    setEditNote(undefined)
                }} 
            />
            <Snackbar open={open} handleClose={handleClose}>
                {
                    message.map(m => (
                        <p key={m}>{m}</p>
                    ))
                }
            </Snackbar>
        </div>
    )
}