import "./index.css"
import FastMessageForm from "../../components/form/FastMessageForm"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import useAuth from "../../hooks/useAuth"
function IndexPage() {
  const user = useAuth(store => store.user)
  const navigate = useNavigate()

  useEffect(()=>{
      if(user !== null){
          navigate("/conversations")
      }
  }, [user])
  
  return (
    <div className="img-cont">
      <FastMessageForm />
    </div>
  )
}

export default IndexPage