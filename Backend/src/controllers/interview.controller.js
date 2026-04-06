// const pdfParse = require('pdf-parse');
const pdfModule = require('pdf-parse-new');
const pdfParse = pdfModule.default?.default || pdfModule.default || pdfModule;
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 */
async function generateInterviewReportController(req, res) {
    try {
        let resumeText = "";
        if (req.file) {
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text;
        }

        const { selfDescription, jobDescription } = req.body;
        const interviewReportByAI = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAI
        });

        res.status(201).json({ message: "Interview Report Generated Successfully!!", interviewReport });
    } catch (error) {
        console.error('Error generating interview report:', error);
        res.status(500).json({ error: 'Failed to generate interview report' });
    }
}

/**
 * @description get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId });
        if (!interviewReport) {
            return res.status(404).json({ error: 'Interview report not found' });
        }
        res.status(200).json({
            message: "Interview Report Fetched Successfully!!",
            interviewReport
        });
    } catch (error) {
        console.error('Error getting interview report:', error);
        res.status(500).json({ error: 'Failed to get interview report' });
    }
}


/**
 * @description get all interview reports of logged in user
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan    ");
        res.status(200).json({
            message: "Interview Reports Fetched Successfully!!",
            interviewReports
        });
    } catch (error) {
        console.error('Error getting interview reports:', error);
        res.status(500).json({ error: 'Failed to get interview reports' });
    }
}

/**
 * @description delete interview report by interviewId
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ error: 'Interview report not found or unauthorized' });
        }

        res.status(200).json({
            message: "Interview Report Deleted Successfully!!"
        });
    } catch (error) {
        console.error('Error deleting interview report:', error);
        res.status(500).json({ error: 'Failed to delete interview report' });
    }
}

/**
 * @description generate resume pdf from interview report Id
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);
        if (!interviewReport) {
            return res.status(404).json({ error: 'Interview report not found' });
        }

        const { resume, selfDescription, jobDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({
            resume,
            selfDescription,
            jobDescription
        });
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume_${interviewReportId}.pdf"`,
            'Content-Length': pdfBuffer.length
        });
        res.end(Buffer.from(pdfBuffer));
    } catch (error) {
        console.error('Error generating resume pdf:', error);
        res.status(500).json({ error: 'Failed to generate resume pdf' });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    generateResumePdfController
}