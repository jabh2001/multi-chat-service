import { useMemo } from "react"
import { useFastMessage } from "../../../hooks/useFastMessage"
import { useParams } from "react-router-dom"
import FastMessageForm from "../../../components/form/FastMessageForm"
import LightingIcon from "../../../components/icons/LightingIcon"

export default function FastMessageDetailPage(){
    const { id } = useParams()
    const { fastMessages } = useFastMessage()
    const message = useMemo(() => fastMessages.find(e => e.id.toString() === id ), [fastMessages])

    return message && (
        // <div className={styles.container}>
        //     <div className={styles.searchBar}>
        //         <h3>{message?.title}</h3>
        //     </div>
        //     <div className={styles.fastMessagesContainer}>
        //         <ReactTabulator
        //             options={{
        //                 layout:"fitColumns"
        //             }}
        //             columns={[
        //                 {field:"text", title:"Content" },
        //                 {field:"base64", title:"Data" },
        //                 {field:"order", title:"Orden" },
        //             ]}
        //             data={message.fastMediaMessages || []}
        //         />
        //     </div>  
        //     <div className={styles.explain}>
        //         <FastMessageForm edit={message} />
        //     </div>
        // </div>
        
        <div className="grid grid-cols-4 bg-gray-200 h-screen">
            <div className="col-span-3">
                {/* <HeaderSearchBar placeholder="Search agents" value={filter} onChange={setFilter} onRemove={()=>setFilter("")} /> */}
                <div>
                    <div className="flex justify-center pt-8">
                        <div className="rounded-xl border border-slate-300 bg-white shadow-default w-[90%]">
                            <div className="py-6 px-4 md:px-6 xl:px-6  border-b border-slate-300">
                                <h4 className="text-xl font-semibold text-black">
                                    Contenido del mensaje rápido "<i className="text-gray-500">{message.title}</i>"
                                </h4>
                            </div>

                            <div className="grid grid-cols-4 border-b border-slate-300 py-4 px-4  md:px-6 2xl:px-6 text-gray-500 bg-gray-100/25">
                                <div className="col-span-1 flex items-center">
                                    <p className="font-medium">Orden</p>
                                </div>
                                <div className="col-span-1 hidden items-center sm:flex">
                                    <p className="font-medium">Mensaje</p>
                                </div>
                                <div className="col-span-2 flex items-center">
                                    <p className="font-medium">Data</p>
                                </div>
                            </div>
                            <div className="max-h-[65vh] overflow-y-scroll">
                                {message.fastMediaMessages?.map(({ id, text, order, messageType }) => (
                                    <div
                                        className="grid grid-cols-4 border-b border-slate-300 py-4 px-4 md:px-6 2xl:px-6"
                                        key={"fastMediaMessage" + id}
                                    >
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {order}
                                            </p>
                                        </div>
                                        <div className="col-span-1 items-center flex">
                                            <p className="text-sm text-black">
                                                {text}
                                            </p>
                                        </div>
                                        <div className="col-span-2 items-center flex">
                                            <p className="text-sm text-black">
                                                {messageType}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="bg-white border-gray-200 p-4 border-l-2">
                <div className="flex justify-start items-center gap-4 text-primary fill-primary text-xl font-bold ">
                    <div>
                        <LightingIcon />
                    </div>
                    <h3>Editar mensaje rápido</h3>
                </div>
                <div className="pt-2">
                    <FastMessageForm edit={message} />
                </div>
            </div>
        </div>
    )
}