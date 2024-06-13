import { useMemo } from 'react';
import ReactDOM from "react-dom"
import { create } from 'zustand';

const container = document.getElementById("bigImage") as HTMLElement

const useImageExpanded = create<{ src:string, setSrc:(src:string) => void}>(set => ({
    src:"",
    setSrc:(src:string) => set({ src }) 
}))

const ImageMessage = ({ src, alt }:{ src:string, alt:string }) => {
    const expandedSrc = useImageExpanded(store => store.src)
    const setSrc = useImageExpanded(store => store.setSrc)
    const isExpanded = useMemo(() => src === expandedSrc, [src, expandedSrc])

    const handleImageClick = () => {
        setSrc(src);
    };
    const handleModalExit = () => {
        setSrc("");
    };

  return (
    <>
        <img onClick={handleImageClick} src={src} alt={alt} className={`transition-transform duration-300 w-full h-full max-w-full max-h-full cursor-pointer rounded-2xl`} />
        { 
            ReactDOM.createPortal((
                isExpanded && (
                    <div className={`cursor-pointer transition-transform duration-300 fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center`} onClick={handleModalExit}>
                        <img src={src} alt={alt} className={`transition-transform duration-300 ${isExpanded ? 'w-auto h-auto max-w-full max-h-full' : 'w-full h-full object-cover'}`} />
                    </div>
                )
            ), container)
        }
    </>
  );
};

export default ImageMessage;
