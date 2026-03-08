import {generateInterviewReport,getInterviewReportById,getAllInterviewReports  , generateResumePdf} from "../services/interview.api.js"
import { useParams} from "react-router"
import { InterviewContext } from "../interview.context.jsx"
import {useContext, useEffect} from "react"

export const useInterview = ()  =>{
   const { interviewId} = useParams();
   const context = useContext(InterviewContext)

   if(!context){
     throw new Error("UseInterview must be used within an Interview Provider")
   }
   const {loading, setLoading, report, setReport, reports, setReports } = context

   const generateReport = async({ jobDescription, selfDescription, resumeFile}) =>{
              setLoading(true)

              try{
                const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile})
                setReport(response.interviewReport);
                return response.interviewReport
              }catch(error){
                console.log("Error in useInterview.js in generateReport frontend-> ", error)
              }finally{
                setLoading(false)
              }
   }
   const getReportById = async( interviewId) =>{
              setLoading(true)

              try{
                const response = await getInterviewReportById(interviewId)
                setReport(response.interviewReport)
              }catch(error){
                console.log("Error in useInterview.js in getReportById frontend-> ", error)
              }finally{
                setLoading(false)
              }
   }
   const getReports = async() =>{
              setLoading(true)

              try{
                const response = await getAllInterviewReports()
                setReports(response.interviewReports)
              }catch(error){
                console.log("Error in useInterview.js in getReports frontend-> ", error)
              }finally{
                setLoading(false)
              }
   }
   
   const getResumePdf = async(interviewReportId) =>{
          setLoading(true)
          let response = null
          try{
               response = await generateResumePdf({interviewReportId})
               const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf"}))
               const link = document.createElement("a")
               link.href = url 
               link.setAttribute("download", `resume_${interviewReportId}.pdf`)
               document.body.appendChild(link)
               link.click
          }catch(error){
             console.log(error)
          } finally{
             setLoading(false)
          }
   }
   useEffect(()=>{
         if(interviewId){
             getReportById(interviewId)
         }else{
            getReports()
         }
       }, [interviewId])
   return {loading, setLoading, report, setReport, reports, setReports,generateReport,  getReportById, getReports , getResumePdf}
}
