import { useRef } from "react"
import Popup from "reactjs-popup"
import useCamera from "../../../../hooks/useCamera"
import useMessageMedia from "../../../../hooks/useMessageMedia"

const CameraButton = () => {
    const ref = useRef<HTMLVideoElement>(document.createElement("video"))
    const appendFile = useMessageMedia(state => state.appendFile)
    const { start, stop, shot, getFile } = useCamera({ target:ref.current})
    const handleClick = () => {
        start()
    }
    const handleClose = () => {
        stop()
    }
    const handleShot = () => {
        shot()
        appendFile(getFile())
        stop()
    }

    return (
        <Popup trigger={(
            <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6">
                <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                    <path d="M0,6.00585866 C0,4.89805351 0.893899798,4 2.0048815,4 L5,4 L7,2 L13,2 L15,4 L17.9951185,4 C19.102384,4 20,4.89706013 20,6.00585866 L20,15.9941413 C20,17.1019465 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1029399 0,15.9941413 L0,6.00585866 Z M10,16 C12.7614237,16 15,13.7614237 15,11 C15,8.23857625 12.7614237,6 10,6 C7.23857625,6 5,8.23857625 5,11 C5,13.7614237 7.23857625,16 10,16 Z M10,14 C11.6568542,14 13,12.6568542 13,11 C13,9.34314575 11.6568542,8 10,8 C8.34314575,8 7,9.34314575 7,11 C7,12.6568542 8.34314575,14 10,14 Z"/>
                </svg>
            </button>
            )}
            modal
            onOpen={handleClick}
            onClose={handleClose}
            className="relative"
        >
                <video className="w-full h-full object-contain" ref={ref}></video>
                <button type="button" className="btn primary absolute bottom-10 right-10" onClick={handleShot}>enviar</button>
        </Popup>
    )
}
export default CameraButton