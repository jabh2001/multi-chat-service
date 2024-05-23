import { createContext, useContext } from "react"
import styles from "./index.module.css"
type StepperProps = {
    children: React.ReactNode
    currentStep:number
}
type StepProps = {
    title:string
    children:string
    step:number
}

const stepContext = createContext<number>(1)

function Stepper({ children, currentStep }:StepperProps){

    return (
        <stepContext.Provider value={currentStep}>
            <ol className={styles.container}>
                {children}
            </ol>
        </ stepContext.Provider>
    )
}

function Step({ title, children, step }:StepProps){
    const currentStep = useContext(stepContext)
    return (
        <li className={`${styles.listItem} ${currentStep >= step ? styles.active:""}`}>
            <div className={styles.numberContainer}>
                <div className={styles.number}>
                    {step}
                </div>
                <div className={styles.divider}></div>
            </div>
            <div className={styles.content}>
                <h3>{title}</h3>
                <p>{children}</p>
            </div>
        </li>
    )
}
export {
    Stepper,
    Step
}