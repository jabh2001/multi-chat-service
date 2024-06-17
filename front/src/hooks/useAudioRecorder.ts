import { useEffect, useRef, useState } from "react"

const useAudioRecorder = () => {
    const reader = useRef(new FileReader()).current
    const [stream, setStream] = useState<MediaStream>()
    const [recorder, setRecorder] = useState<MediaRecorder>()
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [base64Data, setBase64Data] = useState("")
    const [blobData, setBlobData] = useState<Blob>(new Blob([], { type: "audio/ogg; codecs=opus" }))
    const [audio, setAudio] = useState(new Audio())

    useEffect(() => {
        reader.onloadend = function (e) {
            const result = e.target?.result
            if (result && typeof result === "string") {
                setBase64Data(result)
                setAudio(new Audio(result))
            }
        }

        return () => {
            reader.onloadend = null
        }
    }, [])
    useEffect(() => {
        if (stream) {
            const recorder = new MediaRecorder(stream)
            const chunks: Blob[] = []
            recorder.start()

            recorder.addEventListener("dataavailable", e => chunks.push(e.data))

            recorder.addEventListener("stop", () => {
                let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                setBlobData(blob)
                reader.readAsDataURL(blob);
            })

            setRecorder(recorder)
        }
    }, [stream])
    const start = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            setStream(stream)
            setIsRecording(true)
            setBase64Data("")
            setAudio(new Audio)
        }).catch((err) => console.error(err))
        setIsPaused(false)
    }
    const stop = () => {
        recorder?.stop()
        stream?.getAudioTracks().forEach(track => track.stop())
        setStream(undefined)
        setIsRecording(false)
        setIsPaused(false)
    }

    const reanude = () => {
        recorder?.start()
        setIsRecording(true)
        setIsPaused(false)
    }

    const pause = () => {
        recorder?.stop()
        setIsRecording(false)
        setIsPaused(true)
    }

    return {
        isRecording,
        isPaused,
        start,
        stop,
        pause,
        reanude,
        stream,
        base64Data,
        audio,
        getFile(){
            return new File([blobData], "audio.ogg", { type:"audio/ogg" })
        }
    }
}

export default useAudioRecorder