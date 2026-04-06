import "../style/dashboard.scss";
import { useState, useRef } from "react";
import { useInterview } from "../hooks/useInterview.js"
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar/Navbar";
import { useAuth } from "../../auth/hooks/useAuth.js";
import Loader from "../../../components/Loader/Loader.jsx";

const Dashboard = () => {

  const { auth0User, isAuthenticated } = useAuth();
  const { generateReport, loading, reports, deleteReport } = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [fileName, setFileName] = useState("")
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]
    setIsGenerating(true)
    try {
      const data = await generateReport({ jobDescription, resume: resumeFile, selfDescription })
      navigate(`/interview/${data._id}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleRemoveFile = () => {
    setFileName("")
    if (resumeInputRef.current) {
      resumeInputRef.current.value = ""
    }
  }

  const handleDelete = async (e, reportId) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this report?")) {
      await deleteReport(reportId)
    }
  }

  if (isGenerating) {
    return (
      <Loader 
        message="AI is analyzing your profile..." 
        subtext="Our advanced algorithms are crafting a personalized interview preparation plan, technical questions, and skill gap analysis."
      />
    )
  }

  return (
    <main className="dashboard">
      <Navbar />

      <div className="dashboard-nav-breadcrumb">
        <button className="back-home-btn" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="hero">
        {isAuthenticated && (
          <p className="welcome-text">Welcome back, {auth0User?.name || auth0User?.nickname || 'User'}!</p>
        )}
        <h1>AI Interview Preparation Report</h1>
        <p>
          Upload your resume, add a job description, and let AI generate a
          personalized interview preparation report including questions,
          skill gaps, and a preparation plan.
        </p>
      </section>

      {/* Input Section */}
      <section className="interview-input-group">

        {/* Left Side */}
        <div className="left">

          <div className="section-header">
            <h2>Job Description</h2>
            <p>
              Paste the job description of the role you are applying for.
              This helps the AI understand the expectations of the role.
            </p>
          </div>

          <label htmlFor="jobDescription">Job Description</label>

          <textarea
            onChange={(e) => { setJobDescription(e.target.value) }}
            name="jobDescription"
            id="jobDescription"
            placeholder="Example: We are looking for a Junior Web Developer with knowledge of HTML, CSS, JavaScript, and REST APIs..."
          ></textarea>

        </div>

        {/* Right Side */}
        <div className="right">

          {/* Resume Upload */}
          <div className="input-group">

            <div className="section-header">
              <h2>Candidate Information</h2>
              <p>
                Upload your resume and provide a short self description so the
                AI can analyze your profile.
              </p>
            </div>

            <p className="resume-text">
              Resume <span className="highlight">(Recommended)</span>
            </p>

            <label className="file-label" htmlFor="resume">
              Upload Resume (PDF)
            </label>

            <input
              ref={resumeInputRef}
              onChange={handleFileChange}
              hidden
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
            />

            {fileName && (
              <div className="selected-file">
                <div className="file-info">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>{fileName}</span>
                </div>
                <button className="remove-file-btn" onClick={handleRemoveFile}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

            <small className="helper-text">
              Upload a PDF resume for better analysis of your skills and experience.
            </small>

          </div>

          {/* Self Description */}
          <div className="input-group">

            <label htmlFor="selfDescription">Self Description</label>

            <textarea
              onChange={(e) => { setSelfDescription(e.target.value) }}
              name="selfDescription"
              id="selfDescription"
              placeholder="Example: I am a beginner MERN stack developer with experience in JavaScript, React, and Node.js. I enjoy building scalable web applications and continuously improving my development skills..."
            ></textarea>

            <small className="helper-text">
              Briefly describe your background, skills, and career goals.
            </small>

          </div>

          {/* Generate Button */}
          <button className="generate-btn" onClick={handleGenerateReport} disabled={loading}>
            Generate Interview Report
          </button>

          {/* Info Text */}
          <p className="note">
            The AI will analyze your profile and generate technical questions,
            behavioral questions, skill gaps, and a preparation roadmap.
          </p>

        </div>
      </section>

      {/* Recent Reports list*/}
      {reports?.length > 0 && (
        <section className='recent-reports'>
          <h2>My Recent Interview Plans</h2>
          <ul className='reports-list'>
            {reports.map(report => (
              <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                <div className="report-header">
                  <h3>{report.title || 'Untitled Position'}</h3>
                  <button className="delete-btn" onClick={(e) => handleDelete(e, report._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer Info */}
      <section className="info-footer">
        <p>
          Powered by AI to help candidates prepare better for technical interviews.
        </p>
      </section>

    </main>
  );
};

export default Dashboard;