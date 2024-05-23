import { useEffect, useState } from "react"
import {Stepper, Step} from "../../../../components/Stepper"
import styles from "./index.module.css"
import { ChannelView, ChooseChannelView, FinishView } from "./views"
import { useNavigate } from "react-router-dom"
import { postInbox } from "../../../../service/api"
import useInboxStore from "../../../../hooks/useInboxStore"

type Props = {
    channel?:string
}
export default function NewInboxPage({ channel }:Props){
    const addInbox = useInboxStore(state => state.addInbox)
    const navigate = useNavigate()
    const [ step, setStep] = useState(channel? 2 : 1)
    const nextStep = () => setStep(step => step+1)
    const prevStep = () => {
        if(step == 2){
            navigate("/config/inboxes/new")
        } else {
            setStep(step => step-1)
        }
    }
    useEffect(()=>{
        setStep(!channel ? 1 : step>=1 && step <=2 ? 2 : step)
    }, [channel])

    const handleSubmit = async (name:string) => {
        if(channel){
            const inbox = await postInbox({name, channelType:channel?.replace("-", "").toString()})
            addInbox(inbox)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.stepperBar}>
                <Stepper currentStep={step}>
                    <Step title="Chose a channel" step={1}>
                        Chose provider
                    </Step>
                    <Step title="Create Inbox" step={2}>
                        Create a inbox
                    </Step>
                    <Step title="Finish" step={3}>
                        Finish the process, and save changes 
                    </Step>
                </Stepper>
            </div>
            <div className={styles.tabs}>
                { step > 1 && step < 4 && <button className={styles.prevButton} onClick={prevStep}>PREV</button> }
                { step == 1 && <ChooseChannelView /> }
                { step == 2 && <ChannelView nextStep={nextStep} handleSubmit={handleSubmit} /> }
                { step == 3 && <FinishView /> }
            </div>
        </div>
    )
}
