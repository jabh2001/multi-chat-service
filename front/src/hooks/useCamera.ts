import { useEffect, useRef, useState } from "react"
import { convertBase64ToBlob } from "../service/file"


const useCamera = ({ target, onShot }: { target?: HTMLVideoElement, onShot?:(img:HTMLImageElement) => void }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [stream, setStream] = useState<MediaStream>()
    const [base64Data, setBase64Data] = useState("")
    const [blobData, setBlobData] = useState(new Blob([]))
    const video = useRef<HTMLVideoElement>(document.createElement("video")).current
    const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas")).current
  
    useEffect(() => {
      if (stream) {
        video.srcObject = stream
        video.play()
        if (target) {
          target.srcObject = stream
          target.play()
        }
      } else {
        video.pause()
        if (target) {
          target.pause()
        }
      }
    }, [stream])
    const start = () => {
      setIsPlaying(true)
      navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } } }).then(setStream).catch((err) => console.error(err))
    }
    const stop = () => {
      stream?.getVideoTracks().forEach(track => track.stop())
      setStream(undefined)
      setIsPlaying(false)
    }
    const shot = (type="image/png") => {
      var context = canvas.getContext("2d");
      const settings = stream?.getVideoTracks()[0]?.getSettings()
      context?.drawImage(video!, 0, 0, settings?.width!, settings?.height!);
      const base64Data = canvas.toDataURL(type)
      setBlobData(convertBase64ToBlob(base64Data, type))
      setBase64Data(base64Data)
      if(onShot){
        const img = new Image()
        img.src = base64Data
        onShot(img)
      }
    }
  
    return {
      stream,
      base64Data,
      start,
      stop,
      shot,
      isPlaying,
      getFile({filename="image.png", type="image/png"}={}){
        return new File([blobData], filename, { type})
      }
    }
  }
export default useCamera