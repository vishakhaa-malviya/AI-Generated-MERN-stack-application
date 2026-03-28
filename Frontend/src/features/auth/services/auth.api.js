import axios from "axios";

const api = axios.create({
    baseURL: "https://ai-generated-mern-stack-application.onrender.com/",
    withCredentials: true
});

// Har request mein token header mein lagao
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password })
        if (response.data.token) {
            localStorage.setItem('token', response.data.token); // ← save
        }
        return response.data;
    } catch (error) {
        console.log("Error in Login Service Api", error)
        console.log("LOGIN ERROR:", error.response?.data);
         throw error; // ✅ VERY IMPORTANT
    }
}

export async function register({ username, email, password }) {
    try {
        const res = await api.post("/api/auth/register", { username, email, password })
        if (res.data.token) {
            localStorage.setItem('token', res.data.token); // ← save
        }
        return res.data;
    } catch (error) {
        console.log("Error in register Service api --> ", error)
    }
}

export async function logout() {
    try {
        const res = await api.get("/api/auth/logout")
        localStorage.removeItem('token'); // ← remove on logout
        return res.data;
    } catch (error) {
        console.log("Error in Logout Service api --> ", error)
    }
}

export async function getMe() {
    try {
        const res = await api.get("/api/auth/get-me")
        return res.data;
    } catch (error) {
        if (error.response?.status !== 401) {
            console.log("Error in getMe Service api --> ", error)
        }
        return null;
    }
}
// import axios from "axios";

// const api = axios.create({
//     baseURL: "https://ai-generated-mern-stack-application.onrender.com",
//     withCredentials: true
// });

// export async function login({email , password}){
//     try{
//          const response = await api.post("/api/auth/login", {
//             email, password
//          })

//          return response.data;
//     } catch (error){
//         console.log("Error in Login Service Api", error)
//     }
// }

// export async function register({username, email , password}){
//     try {
//         const res = await api.post("/api/auth/register", {
//           username, email, password
//         })
//         return res.data
//     } catch (error) {
//         console.log("Error in register Service api --> ", error)
//     }
// }
// export async function logout(){
//     try {
//         const res = await api.get("/api/auth/logout")
//         return res.data
//     } catch (error) {
//         console.log("Error in Logout Service api --> ", error)
//     }
// }
// export async function getMe() {
//     try {
//         const res = await api.get("/api/auth/get-me")
//         return res.data;
//     } catch (error) {
//         // 401 is expected when user is not logged in - don't log it as error
//         if (error.response?.status !== 401) {
//             console.log("Error in getMe Service api --> ", error)
//         }
//         return null; // ← null return karo, throw mat karo
//     }
// }
// // export async function getMe(){
// //     try {
// //         const res = await api.get("/api/auth/get-me")
// //         return res.data
        
// //     } catch (error) {
// //         console.log("Error in getMe Service api --> ", error)
// //     }
// // }


