import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",
    withCredentials: true
    
})

export const generateInterviewReport = async ({jobDescription, resume, selfDescription}, token) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    if (resume) {
        formData.append("resume", resume)
    }
    formData.append("selfDescription", selfDescription)
    
    const response = await api.post("/api/interview/", formData,{
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }   
    })
    return response.data
}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId, token) => {
    const response = await api.get(`/api/interview/report/${interviewId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async (token) => {
    const response = await api.get(`/api/interview/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data
}


/**
 * @description Service to delete interview report by interviewId.
 */
export const deleteInterviewReport = async (interviewId, token) => {
    const response = await api.delete(`/api/interview/report/${interviewId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async (interviewReportId, token) => {
    const response = await api.get(`/api/interview/resume/pdf/${interviewReportId}`, {
        responseType: "blob",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return response.data
}