import Popup from "reactjs-popup";
import useAuth from "../hooks/useAuth";

export default function ConfirmTooltip({ onConfirm, children }:{ onConfirm: () => void, children:JSX.Element }) {
    const user = useAuth(store => store.user)

    return (
        
        <Popup
            trigger={children}
            position={"top center"}
        >
            <div className="flex flex-col items-center gap-2 text-gray-600 p-2">
                {
                    user && user.role === "admin" ? (
                        <>
                            <p className="text-center">¿Estas seguro de realizar esta acción? es irreversible</p>
                            <button className="btn error link" onClick={onConfirm}>Estoy seguro</button>
                        </>
                    ) : (
                        <p className="text-center">Solo los administradores pueden realizar esta acción</p>
                    )
                }
            </div>
        </Popup>
    )
}