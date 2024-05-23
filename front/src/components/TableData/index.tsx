import { useCallback, useEffect, useState } from "react";
import OrderIcon from "../icons/OrderIcon";
import styles from "./index.module.css"
type TableColumnType = {
    title:string
    name: string;
    isPrimary?: boolean;
    type:"string" | "number" 
}

type Props = {
    columns:Array<TableColumnType>,
    data:Array<any>,
    color?:HeadColor
}
type OrderType = {
    prop:string
    dir:"up" | "down" | "neutral"
}
export default function TableData({ columns, data, color }:Props){
    const [ copyData, setCopyData ] = useState<Array<any>>([...data])
    const [ order, setOrder] = useState<OrderType>({ prop:"none", dir:"up" })
    const switchDir = useCallback(() => setOrder(old => ({...old, dir:old.dir=="up" ? "down": "up" })), [setOrder])
    useEffect(() => {

    }, [ data ])
    useEffect(() => {
        if(order.prop !== "none"){
            let sortedData = [...data]
            const { prop, dir } = order
            sortedData.sort((rowA, rowB) => {
                const compare = dir == "up" ? rowA[prop] > rowB[prop] : rowA[prop] < rowB[prop]
                return rowA[prop] == rowB[prop] ? 0 : compare ? 1 : -1
            })
            
            setCopyData(sortedData)
        } else {
            setCopyData([...data])
        }
    }, [data])

    const handleOrder = (name:string) => {
        if(order.prop!=name){
            setOrder({ prop:name, dir:"up" })
        } else {
            switchDir()
        }
    }
    return (
        <table className={styles.table} style={{ ["--cols" as any]:columns.length, ["--bg-head" as any]: getColor(color)}}>
            <thead className={styles.head}>
                <tr className={styles.row}>
                    {
                        columns.map((column) => (
                            <th className={styles.col} key={`table_head_${column.name}`}>
                                {column.title}
                                <button onClick={()=>handleOrder(column.name)}>
                                    <OrderIcon order={order.prop == column.name ? order.dir : "neutral" } />
                                </button>
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody className={styles.body}>
                {
                    copyData.map((row, index) => (
                        <tr className={styles.row} key={`${index}_${JSON.stringify(row)}`}>
                            {
                                columns.map((column) => (
                                    <td className={styles.col} key={`table_row_${column.name}`}>{row[column.name]}</td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
type HeadColor = "blue" | "red" | "green" | "yellow" | null | undefined

function getColor(color:HeadColor){
    switch(color){
        case "red": return colors.red;
        case "green": return colors.green;
        case "yellow": return colors.yellow;
        case "blue": 
        default: return colors.blue;
    }
}
const colors = {
    blue:"#639bdf",
    red:"#d9292a",
    green:"#50e115",
    yellow:"#f4da47",
}