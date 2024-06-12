import styles from './messageForm.module.css'
import { FunctionComponent, useRef } from "react";
import MessageTextarea from '../MessageTextarea';
import SendButtons from './SendButtons';
import MenuButton from './MenuButton';
import useMessageMedia from '../../hooks/useMessageMedia';
import MediaItem from './MediaItem';
import useMessageForm from '../../hooks/useMessageForm';

const MessageForm: FunctionComponent = () => {
    const files = useMessageMedia(state => state.files)
    const { handleSubmit, message, setMessage, handleSendFastMessage } = useMessageForm()
    const formRef = useRef<HTMLFormElement>(null)
    const submitForm = () => {
        const button:HTMLButtonElement | null | undefined = formRef.current?.querySelector("button[type=submit]")
        button?.click()
    }
    
    return (
        <form className={styles.sender} onSubmit={handleSubmit} ref={formRef}>
            {
                files.length > 0 && <div className={styles.mediaMenu}>
                    { files.map(f => <MediaItem item={f} key={`${f.name}-${f.size}`} /> )}
                </div>
            }
            <MenuButton onSelectMessage={m => {
                handleSendFastMessage(m.id)
            }}/>
            <MessageTextarea setValue={setMessage} value={message} submitForm={submitForm}/>
            <SendButtons />
        </form>
    );
}


export default MessageForm;
