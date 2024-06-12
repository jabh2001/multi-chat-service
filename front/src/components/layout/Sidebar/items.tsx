import { NavLink, useLocation } from "react-router-dom"
import CaretIcon from "../../../components/icons/CaretIcon";

export const NavGroupHeader = ({ handleClick, open, title, pathPrefix, icon }:{ handleClick:any, open?:boolean, title:string, pathPrefix?:string, icon:JSX.Element }) => {
    const location = useLocation();
    const { pathname } = location;
    return (
        
        <NavLink
            to="#"
            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            (pathPrefix && pathname.includes(pathPrefix)) && 'bg-graydark dark:bg-meta-4' }`}
            onClick={(e) => {
                e.preventDefault();
                handleClick()
            }}
      > 
        { icon }
        { title }
        <div className={`stroke-white fill-white transition ${!open ? "rotate-180" : ""}`}>
          <CaretIcon />
        </div>
      </NavLink>
    )
}
export const GroupMenuItem = ({ to, title }:{ to:string, title:string }) => {
    return <li>
      <NavLink
        to={to}
        className={({ isActive }) =>'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' + (isActive && '!text-white') }
      >
        {title}
      </NavLink>
    </li>
}