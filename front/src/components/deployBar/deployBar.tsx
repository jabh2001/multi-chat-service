import { TextButton } from "../textButton/textButton"
import './deployBar.css'
export const DeployBar: React.FC = () => {
    return (
        <div className="buttons">
            <TextButton text="mine" isActive='true' />
            <TextButton text="unassigned"  isActive='false'/>
            <TextButton text="all"  isActive="false"/>
        </div>
    );
};