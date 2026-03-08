
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
// Import the class
const pdfParse= require("pdf-parse")


async function generateInterviewReportController(req, res){
    try{

        const { selfDescription, jobDescription } = req.body;
         // Job description required
         if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
               message: "Job description is required"
            });
             }
             let resumeContent = ""


        if(req.file){

            resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            console.log(resumeContent)
        }


        if (!resumeContent && !selfDescription) {
            return res.status(400).json({ 
                error: "Provide a resume or self-description." 
            });
        }
  
        const interviewReportByAi = await generateInterviewReport(
            resumeContent.text,
            selfDescription,
            jobDescription
       )

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "interview report generated successfully",
            interviewReport
        })

    } catch(error){
        console.log("Error in interview controller ---> ", error);
        res.status(500).json({
            message: "Error in interview controller",
            error: error.message
        })
    }
}
// async function generateInterviewReportController(req, res){
    
//     try{

//         let resumeBuffer = null;
//         let resumeContent = "";

//         if(req.file){
//             resumeBuffer = req.file.buffer;

//             // const parsed = await (
//             //     new pdfParse.PDFParse(
//             //         new Uint8Array(req.file.buffer)
//             //     )
//             // ).getText();

//             // resumeContent = parsed.text;
//             const parsed = await pdfParse(req.file.buffer);
//             resumeContent = parsed.text;
//         }

//         const { selfDescription , jobDescription } = req.body
        
//         if (!resumeBuffer && !selfDescription) {
//             return res.status(400).json({ 
//                 error: "Provide a resume or self-description." 
//             });
//         }

//         const interviewReportByAi = await generateInterviewReport(
//             resumeContent,
//             selfDescription,
//             jobDescription
//         )

//         const interviewReport = await interviewReportModel.create({
//             user: req.user.id,
//             resume: resumeContent,
//             selfDescription,
//             jobDescription,
//             ...interviewReportByAi
//         })

//         res.status(201).json({
//             message: "interview report generated successfully",
//             interviewReport
//         })

//     } 
//     catch(error){
//         console.log("Error in interview controller ---> ", error);

//         res.status(500).json({
//             message: "Error in interview controller"
//         })
//     }
// }
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id})

    if(!interviewReport){
        res.status(404).json({
            message: "Interview Report not found"
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req, res){
    const  interviewReports  =  await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateResumePdfController(req, res){
        const { interviewReportId} = req.params

        const interviewReport = await interviewReportModel.findById(interviewReportId)
        if(!interviewReport){
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        const {resume, jobDescription, selfDescription } = interviewReport
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription})
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })
        res.end(pdfBuffer)
     
}     
module.exports= {generateInterviewReportController, getInterviewReportByIdController , getAllInterviewReportsController, generateResumePdfController}