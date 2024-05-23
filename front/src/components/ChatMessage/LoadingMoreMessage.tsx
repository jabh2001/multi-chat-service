import { forwardRef } from 'react'
import styles from './index.module.css'

// export default function LoadingMoreMessage({ ref }:{ref:RefObject<HTMLDivElement>})
const LoadingMoreMessage = forwardRef<HTMLDivElement, any>((_props, ref) => {
    return (
        
        <div className={styles.container} ref={ref} >
            <div className={`${styles.message} ${styles.load}`}>
                <span></span>
                <span style={{ animationDelay: '0.15s' }}></span>
                <span style={{ animationDelay:  '0.3s' }}></span>
            </div>
        </div>
    )
})
export default LoadingMoreMessage