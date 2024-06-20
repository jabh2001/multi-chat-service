import { SubmitHandler, useForm } from "react-hook-form"
import { AgentType, UserType } from "../../../types"
import styles from "./index.module.css"
import { useAgent } from "../../../hooks/useAgent"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema } from "../../../libs/schemas"
import NormalInput from "../inputs/NormalInput"
import Select from "../inputs/Select"
import Option from "../inputs/Option"
import useSnackbar from "../../../hooks/useSnackbar"
import Snackbar from "../../Snackbar"
import { AxiosError } from "axios"
import AgentProtection from "../AgentProtection"

type Inputs = {
    name:string
    email:string
    role:"admin" | "agent"
    password:string
}
type Keys = "name" | "email" | "role"

export default function AgentForm({ edited, resetEdited }:{ edited:AgentType | UserType | undefined, resetEdited:()=>void }){
    const { handleSubmit, reset, setValue, control } = useForm<Inputs>({ resolver:zodResolver( userSchema.omit({ id:true }) ) })
    const { open, handleClose, message, success, error} = useSnackbar()
    const {addAgent, editAgent} = useAgent()
    const onSubmit:SubmitHandler<Inputs> = async ({ name, email, role, password }) => {
        try{
            if(edited){
                await editAgent(edited.id,{ name, email, role, password })
            } else {
                await addAgent({ name, email, role, password, teams:[] })
            }
            success(`Agente ${ name } registrado`)
        } catch (e:any){
            if(e instanceof AxiosError){
                error(e.response?.data)
            } else {
                error(e.message)
            }
        } finally {
            reset()
            resetEdited && resetEdited()
        }

    }
    useEffect(()=>{
        if(edited){
            for (const key of Object.keys(edited)) {
                if(["name", "email", "role"].includes(key)){
                    setValue(key as Keys, edited[key as Keys])
                }
                
            }
        }
    }, [edited])
    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <AgentProtection>
                <div>
                    
                    <p className={styles.description}>Puedes crear un agente o usuario para que maneje la aplicación </p>
                    <p className={styles.description}>si lo creas de tipo administrador podrás gestionar cada parte de la aplicación, cómo crear eliminar o editar elementos importantes o privados</p>
                    <p className={styles.description}>puedes crearlo de tipo agente y solamente tendrá permiso de lectura así como de responder mensajes que se les ha asignado a este en concreto</p>
                </div>
                <div className={styles.inputsContainer}>
                    <NormalInput control={control} name="name" label="Nombre" />
                    <NormalInput control={control} name="email" label="Correo" />
                    <NormalInput control={control} name="password" label="Contraseña" />
                    <Select control={control} name="role" label="Rol" >
                        <Option value="admin" label="Administrador" />
                        <Option value="agent" label="Agente" />
                    </Select>
                </div>
                <div className={styles.buttonsContainer}>
                    <button className="btn primary">Next</button>
                    <button className="btn secondary">Clear</button>
                </div>
                <Snackbar open={open && message.length > 0 && message[0] !== ""} handleClose={handleClose}>
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