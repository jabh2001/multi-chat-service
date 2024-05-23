import { useCallback, useState } from "react";

export default function useDialogState(){
    const [open, setOpen] = useState(false)

    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])
    const toggle = useCallback(() => setOpen(state => !state), [setOpen])

    return { open, handleOpen, handleClose, toggle }
}