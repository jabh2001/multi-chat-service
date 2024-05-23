import { SubmitHandler, useForm } from "react-hook-form"
import { TeamType } from "../../../types"
import styles from "./index.module.css"
import { useTeam } from "../../../hooks/useTeamStore"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { teamSchema } from "../../../libs/schemas"
import NormalInput from "../inputs/NormalInput"
import Textarea from "../inputs/Textarea"
import AgentProtection from "../AgentProtection"

type Inputs = {
    name:string
    description:string
}
type Keys = "name" | "description"

export default function TeamForm({ edited, resetEdited }:{ edited:TeamType | undefined, resetEdited:()=>void }){
    const { handleSubmit, reset, setValue, control } = useForm<Inputs>({ resolver:zodResolver(teamSchema.omit({ id:true })) })
    const {addTeam, editTeam} = useTeam()
    const onSubmit:SubmitHandler<Inputs> = async ({ name, description }) => {
        try{
            if(edited){
                await editTeam(edited.id,{ name, description })
            } else {
                await addTeam({ name, description })
            }
        } finally {
            reset()
            resetEdited && resetEdited()
        }

    }
    useEffect(()=>{
        if(edited){
            for (const key of Object.keys(edited)) {
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
                <h3 className={styles.title}>Crea un nuevo equipo</h3>
                <p className={styles.description}>
                    los equipos de trabajo sirven para agrupar a tus agentes con un mismo propósito o misión y poder gestionar actividades de una 
                    forma más cómoda sobre todo a la hora de asignar un chat que podrías asignar a varias personas que cumplan la misma misión
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