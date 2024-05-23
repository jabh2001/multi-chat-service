import { InboxDive } from '../../components/inboxDiv/inboxDiv'
import styles from './index.module.css'
import { SideBar } from '../../components/sidebar/sideBar'
import ChatContainer from '../../components/chatContainer'

function ConversationsPage() {
  
  return (
    <div className={styles.landing}>
      <InboxDive/>
      <div className={styles.chatContainer}>
          <ChatContainer/>
      </div >
      <div className={styles.sideBar}>
        <SideBar />
      </div>
    </div>
  )
}

export default ConversationsPage