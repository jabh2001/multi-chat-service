import useAuth from "../../hooks/useAuth"
import useDialogState from "../../hooks/useDialogState"
import { Modal, ModalAction, ModalBody, ModalFooter, ModalHeader } from "../Modal"
import PencilIcon from "../icons/PencilIcon"
import TrashIcon from "../icons/TrashIcon"
import styles from "./index.module.css"

type Props = {
    cell?:any
    onEdit?:(rowData:any) => void
    onDelete?:(rowData:any) => void
}
export const ActionButtons = ({ cell, onEdit, onDelete }:Props) => {
    const { open, handleClose, handleOpen } = useDialogState()
    const user = useAuth(store => store.user)

    const handleDelete = () => {
        onDelete && onDelete(cell.getData())
        handleClose()
    }

    return (<>
        <div className={styles.actions}>
            {user?.role == "admin" && onEdit && <button onClick={() => onEdit(cell.getData())} className="btn icon warning"><PencilIcon /> </button>}
            {user?.role == "admin" && onDelete && <button onClick={handleOpen} className="btn icon error"><TrashIcon /> </button>}
            {user?.role == "agent" && <>Eres agente</>}
        </div>
        <Modal open={open} handleClose={handleClose}>
            <ModalHeader title="Eliminar" />
            <ModalBody>
                Estas seguro de querer eliminar el mensaje: "{cell.getData().title}"
            </ModalBody>
            <ModalFooter>
                <ModalAction title="Eliminar" onClick={handleDelete} />

                <ModalAction title="Cancelar" onClick={handleClose} />
            </ModalFooter>
        </Modal>
    </>)
}