import { RefObject, useEffect } from "react";

export default function useClickOutside<T extends HTMLElement = HTMLElement>(ref:RefObject<T> | RefObject<T>[], handler:(evt:MouseEvent)=>void) {
    useEffect(()=>{
        const clickAny = (event:MouseEvent) => {
            const target = event.target as Node
      
            // Do nothing if the target is not connected element with document
            if (!target || !target.isConnected) {
              return
            }
      
            const isOutside = Array.isArray(ref)
              ? ref
                  .filter(r => Boolean(r.current))
                  .every(r => r.current && !r.current.contains(target))
              : ref.current && !ref.current.contains(target)
      
            if (isOutside) {
              handler(event)
            }
        }
        window.addEventListener("click", clickAny)
        return  () => { window.removeEventListener("click", clickAny)}
    })

}