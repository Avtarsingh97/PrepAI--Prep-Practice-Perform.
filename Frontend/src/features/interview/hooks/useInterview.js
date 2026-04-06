import { generateInterviewReport, getAllInterviewReports, getInterviewReportById, deleteInterviewReport, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import { useAuth0 } from "@auth0/auth0-react"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { getAccessTokenSilently } = useAuth0()
    const { interviewId } = useParams()
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, resume, selfDescription }) => {
        setLoading(true)
        try {
            const token = await getAccessTokenSilently()
            const data = await generateInterviewReport({ jobDescription, resume, selfDescription }, token)
            setReport(data.interviewReport)
            return data.interviewReport
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const token = await getAccessTokenSilently()
            const data = await getInterviewReportById(interviewId, token)
            setReport(data.interviewReport)
            return data.interviewReport
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getAllReports = async () => {
        setLoading(true)
        try {
            const token = await getAccessTokenSilently()
            const data = await getAllInterviewReports(token)
            setReports(data.interviewReports)
            return data.interviewReports
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const deleteReport = async (reportId) => {
        setLoading(true)
        try {
            const token = await getAccessTokenSilently()
            await deleteInterviewReport(reportId, token)
            setReports(prev => prev.filter(report => report._id !== reportId))
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async ( interviewReportId ) => {
        setLoading(true)
        let response = null
        try {
            const token = await getAccessTokenSilently()
            response = await generateResumePdf( interviewReportId, token )
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error generating resume pdf:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getAllReports()
        }
    }, [interviewId])

    return { loading, setLoading, report, setReport, reports, setReports, generateReport, getReportById, getAllReports, deleteReport, getResumePdf }
}
