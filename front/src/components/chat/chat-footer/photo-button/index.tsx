import { useRef } from "react"
import useMessageMedia from "../../../../hooks/useMessageMedia"

const PhotoButton = () => {
    const appendFile = useMessageMedia(state => state.appendFile)
    const input = useRef<HTMLInputElement>(null)

    return (
        <button type="button" className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6" onClick={()=>input.current?.click()}>
            <input
                type="file" 
                className="hidden" 
                ref={input} 
                multiple 
                // accept="image/jpeg"
                onChange={e => {
                    if(!e.target.files){
                        return null
                    }
                    for(const f of e.target.files){
                        appendFile(f)
                    }
                }}
            />
            <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                <path d="M11,13 L8,10 L2,16 L11,16 L18,16 L13,11 L11,13 Z M0,3.99406028 C0,2.8927712 0.898212381,2 1.99079514,2 L18.0092049,2 C19.1086907,2 20,2.89451376 20,3.99406028 L20,16.0059397 C20,17.1072288 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M15,9 C16.1045695,9 17,8.1045695 17,7 C17,5.8954305 16.1045695,5 15,5 C13.8954305,5 13,5.8954305 13,7 C13,8.1045695 13.8954305,9 15,9 Z" />
            </svg>
        </button>
    )
}
export default PhotoButton