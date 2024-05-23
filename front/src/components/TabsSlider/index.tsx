import styles from "./index.module.css"

export function TabsSlider({ children }:{ children:React.ReactNode, page?:number}){

    return (
        <div className={styles.tabsView}>
            <div>
                { children }
            </div>
        </div>
    )
}
export function Tab({ children, visible=false }:any){
    return (
        <div className={`${styles.tab} ${visible && styles.visible }`}>
            { children }
        </div>
    )
}