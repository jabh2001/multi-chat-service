import style from "./index.module.css"

type Props =  {
    title?:string
    children:React.ReactNode
}
export default function MenuSection({ title, children }:Props){
    return <div className={style.menuSection}>
        {title && <h4 className={style.menuSectionTitle}>{title}</h4>}
        {children}
    </div>
}