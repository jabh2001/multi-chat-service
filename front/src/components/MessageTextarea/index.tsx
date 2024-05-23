
import styles from "./index.module.css"

type  Props = {
    value:string
    setValue: (value: string) => void
    submitForm: () => void
}
export default function MessageTextarea({ value, setValue, submitForm}:Props){
    const handleKeyDown = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault()
            submitForm()
        } 
    }
    return (
        <div className={styles.container}>
            <div className={styles.inputContainer}>
                <textarea className={`${styles.textarea}`} value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown}></textarea>
            </div>
        </div>
    )
}