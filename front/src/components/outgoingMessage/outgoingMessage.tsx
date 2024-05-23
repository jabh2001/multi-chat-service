import './outgoingMessage.css'
import { FunctionComponent } from "react";

interface OutgoingMessageProps {
    message:string
}
 
const OutgoingMessage: FunctionComponent<OutgoingMessageProps> = ({message}) => {
    return ( 
        <div className="outgoingContainer" >
            <div className="outgoingMessage">
            <p>{message} </p>

            </div>
        </div>
     );
}
 
export default OutgoingMessage;