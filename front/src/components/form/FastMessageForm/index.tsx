import { useForm } from "react-hook-form";
import NormalInput from "../inputs/NormalInput";
import KeyWordsInput from "./KeyWordsInput";
import MediaMessageInput from "./MediaMessageInput";
import styles from "./index.module.css"
import { useEffect, useState } from "react";
import { convertBase64ToBlob, convertFileToBase64 } from "../../../service/file";
import { useFastMessage } from "../../../hooks/useFastMessage";
import useSnackbar from "../../../hooks/useSnackbar";
import { AxiosError } from "axios";
import { FastMessageType } from "../../../libs/schemas";
import Snackbar from "../../Snackbar";

type Inputs = {
    title:string
    keyWords:string
} & {
    [key in `fastMediaMessageText${number}`]: string;
} & {
    [key in `fastMediaMessageFile${number}`]: File;
}

export default function FastMessageForm({ edit }:{ edit?:FastMessageType}){
    const { addFastMessage, editFastMessage } = useFastMessage()
    const { open, handleClose, error, success, message} = useSnackbar()
    const { control, handleSubmit, setValue, reset } = useForm<Inputs>()
    const [quantity, setQuantity] =useState(1)
    const decrement = () => {
        setQuantity(state => state - 1)
    }
    const increment = () => {
        setQuantity(state => state + 1)
    }
    useEffect(() => {
        if(edit){
            setValue("title", edit.title)
            setValue("keyWords", edit.keyWords)
            if(edit.fastMediaMessages){
                setQuantity(edit.fastMediaMessages.length)
                for(let i=0; i<edit.fastMediaMessages.length;i++){
                    setValue(`fastMediaMessageText${i}`, edit.fastMediaMessages[i].text)
                    if(edit.fastMediaMessages[i].base64){
                        const msg = edit.fastMediaMessages[i]
                        const file =  new File([convertBase64ToBlob(msg.base64, msg.messageType)], msg.messageType)
                        setValue(`fastMediaMessageFile${i}`,file)
                    }
                }
            }
        }
    }, [edit])
    return (
        <form className={styles.container} onSubmit={handleSubmit(async (data) => {
            const { title, keyWords, ...rest } = data
            const sendData:any = {
                fastMessage:{ title: title || "", keyWords:keyWords || "" },
                fastMediaMessage: []
            }
            for (let i = 0; i < quantity; i++) {
                const file = rest[`fastMediaMessageFile${i}`]
                const text = rest[`fastMediaMessageText${i}`]
                const base64 = file ? await convertFileToBase64(file) : undefined
                const messageType = file ? file.type : "text/plain"

                sendData.fastMediaMessage.push({
                    text,
                    messageType,
                    base64,
                    order:i + 1,
                })
            }
            try{
                if(!edit){
                    await addFastMessage(sendData)
                    success("Se ha agregado el mensaje " + sendData.title)
                } else {
                    await editFastMessage(edit.id, sendData)
                    success("Se ha editado el mensaje " + sendData.title)
                }
                reset()
            } catch(e:any){
                if(e instanceof AxiosError){
                    error(e.response?.data?.errors)
                } else {
                    error(e.message)
                }
            }
        })}>
            <div className={styles.title}>
                <NormalInput control={control} name="title" label="Titulo" />  
            </div>
            <div className={styles.keyWords}>
                <KeyWordsInput name="keyWords" control={control} />
            </div>
            <div className={styles.media}>
                <div className={styles.mediaControl}>
                    <button type="button" onClick={decrement}>-</button>
                    <span>Mensajes - {quantity}</span>
                    <button type="button" onClick={increment}>+</button>
                </div>
                <MediaMessageInput 
                    name="fastMediaMessage" 
                    control={control} 
                    quantity={quantity} 
                />
            </div>
            <div className={styles.send}>
                <button className="btn primary">Enviar</button>
            </div>
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

// Array(keyWordsCount).map((_, i) => <NormalInput key={`key-words-input-${name}-${i}`} name={`${name}-${i}`} control={control} />)