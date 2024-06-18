import useAudioRecorder from "../../../../hooks/useAudioRecorder"
import useMessageMedia from "../../../../hooks/useMessageMedia"
import { useEffect } from "react"

const MicrophoneButton = () => {
    const { isRecording, base64Data, getFile, start, stop} = useAudioRecorder()
    const appendFile = useMessageMedia(state => state.appendFile)
    useEffect(() => {
        if(base64Data !== ""){
            appendFile(getFile())
        }
    }, [base64Data])
    const handleClick = () => {
        if(isRecording){
            stop()
        } else {
            console.log("start")
            start()
        }
    }
    return (
        <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6" onClick={handleClick}>
            {
                !isRecording ? (
                    <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                        <path d="M9,18 L9,16.9379599 C5.05368842,16.4447356 2,13.0713165 2,9 L4,9 L4,9.00181488 C4,12.3172241 6.6862915,15 10,15 C13.3069658,15 16,12.314521 16,9.00181488 L16,9 L18,9 C18,13.0790094 14.9395595,16.4450043 11,16.9378859 L11,18 L14,18 L14,20 L6,20 L6,18 L9,18 L9,18 Z M6,4.00650452 C6,1.79377317 7.79535615,0 10,0 C12.209139,0 14,1.79394555 14,4.00650452 L14,8.99349548 C14,11.2062268 12.2046438,13 10,13 C7.790861,13 6,11.2060545 6,8.99349548 L6,4.00650452 L6,4.00650452 Z" />
                    </svg>
                ) : (
                    <svg className="w-full h-full fill-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4 18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12z"></path>
                        </g>
                    </svg>
                )
            }
        </button>
    )
}

export default MicrophoneButton
