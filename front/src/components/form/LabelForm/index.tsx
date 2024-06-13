import { SubmitHandler, useForm } from "react-hook-form"
import styles from "./index.module.css"
import { useLabel } from "../../../hooks/useLabelStore"
import { LabelType } from "../../../types"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { labelSchema } from "../../../libs/schemas"
import NormalInput from "../inputs/NormalInput"
import Textarea from "../inputs/Textarea"
import AgentProtection from "../AgentProtection"

type Inputs = {
    name:string
    description:string
}
type Keys = "name" | "description"
export default function LabelForm({ edited, resetEdited }:{ edited:LabelType | undefined, resetEdited:()=>void }){
    const { handleSubmit, reset, setValue, control } = useForm<Inputs>({ resolver:zodResolver(labelSchema.omit({ id:true })) })
    const {addLabel, editLabel} = useLabel()
    const onSubmit:SubmitHandler<Inputs> = async ({ name, description }) => {
        try{
            if(edited){
                await editLabel(edited.id,{ name, description })
            } else {
                await addLabel({ name, description })
            }
        } finally {
            reset()
            resetEdited && resetEdited()
        }

    }
    useEffect(()=>{
        if(edited){
            for (const key of Object.keys(edited)) {
                console.log(key);
                if(["name", "description"].includes(key)){
                    setValue(key as Keys, edited[key as Keys])
                }
                
            }
        }
    }, [edited])
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <AgentProtection >
                <div>
                    <p className={styles.description}> 
                        puedes crear etiqueta para poder gestionar y agrupar los contactos que tengas almacenados en el sistema 
                        y así poder buscarlos de una mejor forma o calificarlo del modo en el que quieras por ejemplo un cliente que esté interesado en un tipo de 
                        producto en específico o un cliente con el que ya se acordado un servicio o un pago esto también le permitirá a tus agentes poder saber en 
                        qué punto de la conversación estás con un contacto
                    </p>
                </div>
                <div className={styles.inputsContainer}>
                    <NormalInput control={control} name="name" label="Nombre" />
                    <Textarea control={control} name="description" label="Descripción" />
                </div>
                <div className={styles.buttonsContainer}>
                    <button className="btn primary">Guardar</button>
                    <button className="btn secondary">Cancelar</button>
                </div>
            </AgentProtection>
        </form>
    )
}