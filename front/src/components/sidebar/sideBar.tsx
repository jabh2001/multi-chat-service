import { FC } from 'react'
import './sideBar.css'
import { ContactType } from '../../types'
import ContactCard from '../cards/ContactCard'
import { useConversationStore } from '../../hooks/useConversations'
import AssignedForm from '../form/AssignedForm'

interface sideBarProps {
    contact?: ContactType
}

export const SideBar: FC<sideBarProps> = () => {
    const contact = useConversationStore(state => state.contact)
    if(!contact){
        return <></>
    }
    return <div className='sideBar'>
        <ContactCard contact={contact} />
        
        <div className="actions">
            <p>Conversation actions</p>
        </div>
        {/* estos serán selectores */}
        <div className="agentInfo">
            <AssignedForm />
        </div>
    </div>
}