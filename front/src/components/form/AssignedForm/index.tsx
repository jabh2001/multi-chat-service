import { useForm } from "react-hook-form"
import { useTeam } from "../../../hooks/useTeamStore"
import { useAgent } from "../../../hooks/useAgent"
import Select from "../inputs/Select"
import Separated from "../inputs/Separated"
import Option from "../inputs/Option"
import Snackbar from "../../Snackbar"
import { AxiosError } from "axios"
import { assignedConversation } from "../../../service/api"
import { useConversationStore } from "../../../hooks/useConversations"
import useSnackbar from "../../../hooks/useSnackbar"
import AgentProtection from "../AgentProtection"

type Inputs = {
    assigned:string
}
export default function AssignedForm({ onAdd }:{ onAdd?:(conversation:any) => void}){
    const conversation = useConversationStore(state=>state.conversation)
    const { open, handleClose, message, color, error, success} = useSnackbar()
    const {handleSubmit, control} = useForm<Inputs>()
    const {teams} = useTeam()
    const {agents} = useAgent()
    const onSubmit = handleSubmit(async({ assigned }) => {
        try {
            if(!conversation){
                throw new Error("No Conversation Selected")
            }
            const [key, value] = assigned.split("_")
            const updatedConversation = await assignedConversation(conversation.inboxId, conversation.id, { [key]:value })
            onAdd && onAdd(updatedConversation)
            success("Se ha asignado la conversación correctamente")
        } catch (e){
            if(e instanceof AxiosError){
                error(...e.response?.data)
            } else {
                error((e as any).message)
            }
        }
    })
    return (
        <form onSubmit={onSubmit} style={{ padding: 8, borderBlock:"1px solid #ddd"}}>
            <AgentProtection >
            <h3>Asignar esta conversación a:</h3>
            <Select control={control} label='Agente asignado' name="assigned" dark>
                <Separated text='Usuarios' />
                {
                    agents.map((agent) => (
                        <Option
                            key={`assignedAgentOption-${agent.id}`}
                            value={"user_" + agent.id}
                            label={agent.name}
                        
                        />
                    ))
                }
                <Separated text='Equipos' />
                {
                    teams.map((team) => (
                        <Option
                            key={`assignedTeamOption-${team.id}`}
                            value={"team_" + team.id}
                            label={team.name}
                        
                        />
                    ))
                }
            </Select>
            <div style={{ display:"flex", justifyContent:"center" }}>
                <button className="btn primary" style={{ width:"80%"}}>Asignar</button>
            </div>
            <Snackbar open={open} handleClose={handleClose} color={color}>
                {
                    message.map(m => ( <p>{m}</p> ) )
                }
            </Snackbar>
            </AgentProtection>
        </form>
    )
}