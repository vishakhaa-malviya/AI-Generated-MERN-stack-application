const express = require("express");
const interviewRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const { generateInterviewReportController , getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController} = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')
/**
 * @route POST /api/interview
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */
interviewRouter.post('/', authMiddleware,upload.single("resume"), generateInterviewReportController)
/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interviewId
 * @access private
 */
interviewRouter.get('/report/:interviewId', authMiddleware, getInterviewReportByIdController)
/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */
interviewRouter.get('/', authMiddleware, getAllInterviewReportsController)

/**
 * @route GET/api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description , resume content and job description
 * @access private
 */
interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware, generateResumePdfController)
module.exports = interviewRouter