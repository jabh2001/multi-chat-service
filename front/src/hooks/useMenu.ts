import { RefObject, createContext, useContext } from "react"

type MenuContextType = {
    ref:null | RefObject<HTMLDivElement>,
    openedMenuName:string,
    setOpenedMenuName: React.Dispatch<React.SetStateAction<string>>
}
const menuContext = createContext<MenuContextType>({ ref:null, openedMenuName:"null", setOpenedMenuName(){}})

function useMenuNavbar(){
    return useContext(menuContext)
}

export {
    menuContext,
    useMenuNavbar
}