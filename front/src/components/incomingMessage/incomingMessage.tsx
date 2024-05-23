import { FunctionComponent } from "react";
import './incomingsMessage.css'

interface IncomingMessageProps {
    message: string
}

const IncomingMessage: FunctionComponent<IncomingMessageProps> = (props: IncomingMessageProps) => {
    return (
        <div className="incomingContainer">
            <div className="incomingMessage">
                <p>
                    {props.message}

                </p>
            </div>
        </div>
    );
}

export default IncomingMessage;