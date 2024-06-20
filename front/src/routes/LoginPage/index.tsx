import { useForm } from "react-hook-form"
import useAuth from "../../hooks/useAuth"
import Snackbar from "../../components/Snackbar"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import bgImage from "../../assets/login-background.jpg"

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
    const {register, handleSubmit} = useForm<Inputs>({ defaultValues:{email:"", password:""}})


    useEffect(()=>{
        if(user !== null){
            navigate("/")
        }
    }, [user])
    return (
        <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <img src={bgImage} alt="BG" className="absolute w-screen h-screen top-0 left-0 z-10 object-cover blur" />
            <div className=" bg-white w-[400px] py-16 rounded-xl relative  z-20 mx-auto">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Inicia sesión</h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit(async ({ email, password })=>{
                        try{
                            await signIn(email, password)
                        } catch(e){
                            if(e instanceof AxiosError){
                                setMessages(e.response?.data?.errors)
                                setOpen(true)
                            }
                        }
                    })}>
                        
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Correo</label>
                        <div className="mt-2">
                            <input
                                {...register("email", { })}
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
                        </div>
                        <div className="mt-2">
                            <input 
                                {...register("password")}
                                type="password"

                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Iniciar
                        </button>
                    </div>
                        {/* <h3 className={styles.title}>Inicia sesión</h3>
                        <NormalInput control={control} name="email" label="Correo"/>
                        <NormalInput type="password" control={control} name="password" label="Contraseña"/>
                        <div className={styles.button}>
                            <button type="submit" className="btn primary">Enviar</button>
                        </div>
                        <p>{user?.email}</p> */}
                    </form>
                    <Snackbar open={open} handleClose={()=>setOpen(false)} color="error">
                    { messages ? messages.map(msg => (<p key={msg}>{msg}</p>) ): " Error de inicio de sesión"}
                    </Snackbar>
                </div>
            </div>
        </div>
    )
}