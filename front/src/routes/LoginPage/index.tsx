import { useForm } from "react-hook-form"
import styles from "./loginPage.module.css"
import NormalInput from "../../components/form/inputs/NormalInput"
import useAuth from "../../hooks/useAuth"
import Snackbar from "../../components/Snackbar"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

type Inputs = {
    email:string
    password:string
}
export default function LoginPage(){
    const user = useAuth(store => store.user)
    const signIn = useAuth(store => store.signIn)
    const navigate = useNavigate()
    const [ open, setOpen ] = useState(false)
    const [ messages, setMessages] = useState([""])
    const {control, handleSubmit} = useForm<Inputs>({ defaultValues:{email:"", password:""}})

    useEffect(()=>{
        if(user !== null){
            navigate("/")
        }
    }, [user])
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit(async ({ email, password })=>{
                try{

                    await signIn(email, password)
                } catch(e){
                    if(e instanceof AxiosError){
                        setMessages(e.response?.data?.errors)
                        setOpen(true)
                    }
                }
            })}>
                <h3 className={styles.title}>Inicia sesión</h3>
                <NormalInput control={control} name="email" label="Correo"/>
                <NormalInput type="password" control={control} name="password" label="Contraseña"/>
                <div className={styles.button}>
                    <button type="submit" className="btn primary">Enviar</button>
                </div>
                <p>{user?.email}</p>
            </form>
            <Snackbar open={open} handleClose={()=>setOpen(false)} color="error">
               { messages ? messages.map(msg => (<p key={msg}>{msg}</p>) ): " Error de inicio de sesión"}
            </Snackbar>
        </div>
    )
}