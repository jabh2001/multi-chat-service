import { Outlet, useNavigate } from "react-router-dom";
import VerticalMenu from "./VerticalMenu";
import styles from "./index.module.css"
import SSEProvider from "../SSEProvider";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

export default function Layout(){
    const user = useAuth(store => store.user)
    const navigate = useNavigate()
    useEffect(()=>{
        if(user === null){
            navigate("/login")
        }
    }, [user])
    return (
        <SSEProvider>
            <div className={styles.layout}>
                <div>
                    <VerticalMenu />
                </div>
                <main>
                    <Outlet />
                </main>
            </div>
        </SSEProvider>
    )
}