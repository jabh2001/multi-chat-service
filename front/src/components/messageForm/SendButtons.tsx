import PaperPlaneTopIcon from "../icons/PaperPlaneTopIcon"
import styles from "./sendButton.module.css"

export default function SendButtons(){
    return (
        <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button + " " + styles.rotate}>
                <PaperPlaneTopIcon />
            </button>
        </div>
    )
}
// const MicrophoneButton = () => {
//     const { isRecording, getFile, start, stop} = useAudioRecorder()
//     const appendFile = useMessageMedia(state => state.appendFile)
//     const handleClick = () => {
//         if(isRecording){
//             stop()
//             appendFile(getFile())
//         } else {
//             start()
//         }
//     }
//     return (
//         <button type="button" className={`${styles.button} ${isRecording && styles.recording} `} onClick={handleClick}>
//             <MicrophoneIcon />
//             <div className={styles.recordBg}></div>
//         </button>
//     )
// }

// const CameraButton = () => {
//     const ref = useRef<HTMLVideoElement>(document.createElement("video"))
//     const appendFile = useMessageMedia(state => state.appendFile)
//     const { start, stop, shot, getFile } = useCamera({ target:ref.current})
//     const [open, setOpen] = useState(false)
//     const handleClick = () => {
//         start()
//         setOpen(!open)
//     }
//     const handleClose = () => {
//         setOpen(false)
//         stop()
//     }
//     const handleShot = () => {
//         shot()
//         appendFile(getFile())
//         stop()
//     }

//     return (
//         <>
//             <Modal size="xl" open={open} handleClose={handleClose}>
//                 <ModalHeader title={"ScreenShot"} />
//                 <ModalBody>
//                     <video className={styles.camContainer} ref={ref}></video>
//                 </ModalBody>
//                 <ModalFooter>
//                     <ModalAction title="Tomar" onClick={handleShot} />
//                 </ModalFooter>
//             </Modal>
//             <button type="button" className={`${styles.button} ${open && styles.recording} `} onClick={handleClick}>
//                 <CameraIcon />
//                 {/* <div className={styles.recordBg}></div> */}
//             </button>
//         </>
//     )
// }