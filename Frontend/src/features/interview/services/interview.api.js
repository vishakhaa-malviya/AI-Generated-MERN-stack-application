import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const generateInterviewReport = async({selfDescription, jobDescription, resumeFile}) => {
    try{
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        formData.append("selfDescription", selfDescription)
        if(resumeFile){
            formData.append("resume", resumeFile)
        }

        const response = await api.post("/api/interview", formData
            , {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
        return response.data;
    }catch(error){
         console.log("error in generateInterviewReport frontend api --> ", error)
        
    }
}
export const getInterviewReportById = async(interviewId) => {
    try{
      
        const response = await api.get(`/api/interview/report/${interviewId}`)
        return response.data;
    }catch(error){
         console.log("error in getInterviewReportById frontend api --> ", error)
        
    }
}
export const getAllInterviewReports = async() => {
    try{
      
        const response = await api.get(`/api/interview/`)
        return response.data;
    }catch(error){
         console.log("error in getInterviewReportById frontend api --> ", error)
        
    }
}

export const generateResumePdf = async({ interviewReportId}) =>{
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null,{
         responseType: "blob"
    });
   return response.data
}