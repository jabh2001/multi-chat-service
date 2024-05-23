import { useRef } from "react";
import { Tabulator } from "react-tabulator/lib/types/TabulatorTypes";


export default function useTabulatorFilters(){
    const tabulatorRef = useRef<Tabulator>()

    
    return {
        tabulatorRef,
        onRef(ref:any){
            tabulatorRef.current = ref.current
        },
        include(field:string, param:string){
            tabulatorRef.current?.setFilter((data, param)=>{
                if(!param || !data[field] )return false;
                
                return data[field].toString().toLowerCase().includes(param)
            }, param.toLowerCase())
        },
        clearFilters(){
            tabulatorRef.current?.clearFilter(true)
        }
    }
}