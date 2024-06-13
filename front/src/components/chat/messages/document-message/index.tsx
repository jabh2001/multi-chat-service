import { getDocumentColor, getDocumentName, getDocumentUrl } from "../../../../service/file";
import styles from "./styles.module.css"

export default  function DocumentMessage({ content, buffer }:{ content:string, buffer:string}) {
    const handleClick = () => {
        const linkSource = `data:${getDocumentUrl(content)};base64,${buffer}`
        const downloadLink = document.createElement("a")
        downloadLink.href = linkSource
        downloadLink.download = content
        downloadLink.click()
    }
    return (
        <div className={styles.documentContainer}>
            <div className={styles.chatMessage}>{content}</div>
            <button className={styles.button} style={{"--clr": getDocumentColor(content)} as any} onClick={handleClick}>
                <span className={styles.button_decor}></span>
                <div className={styles.button_content}>
                    <div className={styles.button__icon}>
                        {getDocumentName(content)}
                    </div>
                    <span className={styles.button__text}>
                        Descargar
                    </span>
                </div>
            </button>
        </div>
    )
}