import styles from './messageForm.module.css'
import { FunctionComponent } from "react";
import MessageTextarea from '../MessageTextarea';
import SendButtons from './SendButtons';
import MenuButton from './MenuButton';
import useMessageMedia from '../../hooks/useMessageMedia';
import MediaItem from './MediaItem';
import useMessageForm from '../../hooks/useMessageForm';

const MessageForm: FunctionComponent = () => {
    const files = useMessageMedia(state => state.files)
    const { handleSubmit, message, setMessage, handleSendFastMessage } = useMessageForm()
    
    return (
        <form className={styles.sender} onSubmit={handleSubmit}>
            {
                files.length > 0 && <div className={styles.mediaMenu}>
                    { files.map(f => <MediaItem item={f} key={`${f.name}-${f.size}`} /> )}
                </div>
            }
            <MenuButton onSelectMessage={m => {
                handleSendFastMessage(m.id)
            }}/>
            <MessageTextarea setValue={setMessage} value={message} submitForm={() => {}}/>
            <SendButtons />
        </form>
    );
}


export default MessageForm;
