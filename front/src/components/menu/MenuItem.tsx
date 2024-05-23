import { NavLink, useLocation } from "react-router-dom"
import style from "./index.module.css"
import { useMemo } from "react"

type Props = {
    icon:React.ReactNode
    title:string
    to:string
}

export default function MenuItem({ icon, title, to }:Props){
    const { search } = useLocation()
    const locationSearch = useMemo(() => new URLSearchParams(search), [search])
    const toSearch = useMemo(() => new URL(to, location.origin).searchParams, [search])

    return <NavLink to={to} className={({ isActive }) => `${style.menuItem} ${isActive && locationSearch.toString() == toSearch.toString() ? style.active : ""}`}>
        <span  className={style.icon}>{icon}</span>
        <span>{title}</span>
    </NavLink>
}