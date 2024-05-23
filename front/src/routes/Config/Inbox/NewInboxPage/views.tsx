import { useState } from "react"
import ProviderCard from "../../../../components/cards/ProviderCard"
import styles from "./index.module.css"

export function ChooseChannelView(){
    return (
        
        <View title="Choose a channel">
            <div className={styles.providerContainer}>
                <ProviderCard
                        title="WhatsApp"
                        src="https://assets.dryicons.com/uploads/icon/svg/8401/02dbf6c2-8309-4e89-8ff6-a7ea954b78c1.svg"
                        to="/config/inboxes/new/whats-app"
                    />
                    <ProviderCard
                        title="Telegram"
                        src="https://cdn3.iconfinder.com/data/icons/social-media-chamfered-corner/154/telegram-512.png"
                        to="/config/inboxes/new/telegram"
                    />
                    <ProviderCard
                        title="Api"
                        src="https://w7.pngwing.com/pngs/1020/679/png-transparent-application-programming-interface-computer-icons-api-management-world-wide-web-text-rectangle-logo.png"
                        to="/config/inboxes/new/api"
                    />
            </div>
        </View>
    )
}

export function ChannelView({ nextStep, handleSubmit }:{ nextStep:()=>void, handleSubmit:(name:string)=>Promise<void>}){
    const [ name, setName ] = useState<string>("")
    const handleClick = async () => {
        try {
            await handleSubmit(name)
            setName("")
            nextStep()
        } catch {
            alert("Error")
        }
    }
    return (
        <View title="Set a inbox data">
            <div className={styles.channelContainer}>
                <div>
                    <label className="input">
                        <span>Set a inbox name</span>
                        <input type="text" placeholder="Inbox name" onChange={e => setName(e.target.value)} />
                    </label>
                </div>
                <div>
                    <button className="btn primary" onClick={handleClick}>Next step</button>
                </div>
            </div>
        </View>
    )
}

export function FinishView(){
    return (
        <View title="Inbox was created ">
            <div>
                
            </div>
        </View>
    )
}

function View({ title, children }:any){
    return (
        <div className={styles.viewContainer}>
            <div className={styles.viewTitle}>
                <h3>{title}</h3>
                <p>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum error nulla perferendis illum explicabo quisquam, voluptate provident excepturi sunt modi fuga, temporibus eos odio! Tenetur aliquid esse sed voluptatum. Necessitatibus.
                </p>
            </div>
            <div className={styles.viewMain}>
                {children}
            </div>
        </div>
    )
}