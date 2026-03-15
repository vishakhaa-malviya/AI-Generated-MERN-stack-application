import { useContext } from "react";
import { AuthContext } from "../auth.context";

import {login , logout, register, getMe} from "../services/auth.api"
import { useEffect } from "react";
export const useAuth = () =>{

    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context 

    const handleLogin = async ({email, password}) => {
        setLoading(true)
        try{

            const data = await login({email , password})
            setUser(data.user)
        }catch(error){
            console.log("Error in handleLogin-> ", error)
        }finally{

            setLoading(false)
        }
    }

    const handleRegister = async({username, email, password}) => {
        setLoading(true)
        try{

            const data = await register({username, email, password})
            setUser(data.user);
        }catch(error){
          console.log("Error in handleRegister-> ", error)
        }finally{
            setLoading(false)

        }
    }

    const handleLogout = async() =>{
        setLoading(true);
        try{

            const data = await logout()
            setUser(null);
        }catch(error){
           console.log("Error in handleLogout -> ", error)
        }finally{

            setLoading(false)
        }
    }
    
    useEffect(()=>{

    const getAndSetUser = async () => {
    try {
      const data = await getMe();
      console.log(data)
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }

    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null); // token invalid or expired
      } else {
        console.log("Error in getAndSetUser ->", error);
      }
    } finally {
      setLoading(false);
    }
  };

            getAndSetUser()
    }, [])
    
    return {user, loading, handleLogin, handleLogout, handleRegister}
}