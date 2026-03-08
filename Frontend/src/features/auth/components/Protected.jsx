import { useAuth } from "../hooks/useAuth";
import { useNavigate , NavLink} from "react-router";

import React from 'react'

const Protected = ({children}) => {
    const navigate = useNavigate();
     
    const {loading, user} = useAuth();
   
   if (loading) {
  return (
    <main className="loading-screen">
      <h1>Loading ...</h1>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" />
      </div>
    </main>
  )
}
    if(!user){
       <NavLink to="/login">Login</NavLink>

    }
  return children
}

export default Protected