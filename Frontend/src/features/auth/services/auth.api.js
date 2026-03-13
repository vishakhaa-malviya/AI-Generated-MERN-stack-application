import axios from "axios";

const api = axios.create({
    baseURL: "https://ai-generated-mern-stack-application.onrender.com",
    withCredentials: true
});

export async function login({email , password}){
    try{
         const response = await api.post("/api/auth/login", {
            email, password
         })

         return response.data;
    } catch (error){
        console.log("Error in Login Service Api", error)
    }
}

export async function register({username, email , password}){
    try {
        const res = await api.post("/api/auth/register", {
          username, email, password
        })
        return res.data
    } catch (error) {
        console.log("Error in register Service api --> ", error)
    }
}
export async function logout(){
    try {
        const res = await api.get("/api/auth/logout")
        return res.data
    } catch (error) {
        console.log("Error in Logout Service api --> ", error)
    }
}
export async function getMe(){
    try {
        const res = await api.get("/api/auth/get-me")
        return res.data
        
    } catch (error) {
        console.log("Error in getMe Service api --> ", error)
    }
}


