import React, { useEffect, useState } from 'react';
import styles from './index.module.css'
import { useSSE } from '../../hooks/useSSE';
import { InboxType } from '../../types';
import { getInboxes } from '../../service/api';

const QrPage: React.FC = () => {
    const [inboxes, setInboxes] = useState<InboxType[]>([])
    const evtSrc = useSSE()
    useEffect(()=>{
        getInboxes().then(setInboxes)
    }, [])
    useEffect(()=>{
        if(evtSrc){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
            const func = (_e:MessageEvent<any>) => {
                console.log("Mensaje recibido")
            }
            evtSrc.addEventListener("qr", func)
            return  ()=>evtSrc!.removeEventListener("qr", func)
        }
    }, [evtSrc])

    return (
        <div className={styles.divPrincipal}>
            {
                inboxes.map((inbox) => {
                    return <div key={inbox.id + "_" + inbox.name}>
                        <img src={`data:image/png;base64,${inbox.qr}`} alt="" />
                        <p>
                            
                            {inbox.name}
                            <span>{"  "}</span>
                            {inbox.user ? "activo" : "debe scannear"}
                        </p>
                    </div>
                })
            }
        </div>
    );
};

export default QrPage;
