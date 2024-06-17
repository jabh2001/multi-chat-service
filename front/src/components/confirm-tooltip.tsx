import Popup from "reactjs-popup";

export default function ConfirmTooltip({ onConfirm, children }:{ onConfirm: () => void, children:JSX.Element }) {

    return (
        
        <Popup
            trigger={children}
            position={"top center"}
        >
            <div className="flex flex-col items-center gap-2 text-gray-600 p-2">
                <p className="text-center">¿Estas seguro de realizar esta acción? es irreversible</p>
                <button className="btn error link" onClick={onConfirm}>Estoy seguro</button>
            </div>
        </Popup>
    )
}