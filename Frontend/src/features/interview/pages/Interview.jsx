import React, { useState , useEffect} from 'react';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview';
import { useParams } from 'react-router';
import Loader from '../../../components/Loader/Loader.jsx';

// Icons as basic SVG components
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);


const Interview = () => {

  const [activeTab, setActiveTab] = useState('technical');
  const [expandedStates, setExpandedStates] = useState({
    technical: [],
    behavioral: [],
    roadmap: []
  });
  const {report, getReportById, loading, getResumePdf} = useInterview()
  const {interviewId} = useParams()

  useEffect(()=>{
    if(interviewId){
      getReportById(interviewId)
    }
  },[interviewId])

  const toggleAccordion = (index) => {
    setExpandedStates(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].includes(index) 
        ? prev[activeTab].filter(i => i !== index) 
        : [...prev[activeTab], index]
    }));
  };

  if(loading || !report){
    return (
      <Loader 
        message="AI is preparing your interview data..." 
        subtext="Please wait while we fetch your analysis, technical questions, and personalized preparation plan."
      />
    )
  }

  const renderContent = () => {
    let list = [];
    let title = "";
    
    if (activeTab === 'technical') {
      list = report.technicalQuestions;
      title = "Technical Questions";
    } else if (activeTab === 'behavioral') {
      list = report.behavioralQuestions;
      title = "Behavioral Questions";
    } else if (activeTab === 'roadmap') {
      // Very basic rendering for roadmap
      list = report.preparationPlan.map(p => ({
        question: `Day ${p.day}: ${p.focus}`,
        answer: p.task.map(item => (<li>{item}</li>))
      }));  
      title = "Road Map";
    }

    return (
      <div className="content-container">
        <div className="content-header">
          <h2>{title}</h2>
          <span className="count-pill">{list.length} {list.length === 1 ? 'item' : 'questions'}</span>
        </div>
        
        <div className="accordion-list">
          {list.map((item, index) => {
            const isExpanded = expandedStates[activeTab]?.includes(index);
            return (
              <div key={index} className={`accordion-item ${isExpanded ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                  <div className="accordion-title-area">
                    <span className="q-label">Q{index + 1}</span>
                    <p className="q-text">{item.question}</p>
                  </div>
                  <button className="chevron-btn">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                {isExpanded && (
                  <div className="accordion-body">
                    {activeTab !== 'roadmap' && <p><strong>Intent:</strong> {item.intention || 'N/A'}</p>}
                    {activeTab !== 'roadmap' ? (<p><strong>Ideal Answer:</strong> {item.answer}</p>) : (<p><strong>Topics to cover:</strong> {item.answer}</p>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="interview-page">
      <div className="interview-grid">
        
        {/* Left Sidebar */}
        <aside className="sidebar-left">
          <p className="section-title">SECTIONS</p>
          <ul className="nav-menu">
            <li 
              className={activeTab === 'technical' ? 'active' : ''} 
              onClick={() => setActiveTab('technical')}
            >
              <CodeIcon /> Technical Questions
            </li>
            <li 
              className={activeTab === 'behavioral' ? 'active' : ''} 
              onClick={() => setActiveTab('behavioral')}
            >
              <ChatIcon /> Behavioral Questions
            </li>
            <li 
              className={activeTab === 'roadmap' ? 'active' : ''} 
              onClick={() => setActiveTab('roadmap')}
            >
              <SendIcon /> Road Map
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <section className="main-area">
          {renderContent()}
        </section>

        {/* Right Sidebar */}
        <aside className="sidebar-right">
          <div className="match-score-section">
            <p className="section-title">MATCH SCORE</p>
            <div className="circle-container">
              {/* Simple CSS donut chart visualization */}
              <div className="donut-chart">
                <svg viewBox="0 0 36 36" className="circular-chart green">
                  <path className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    strokeDasharray={`${report.matchScore}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="19" className="percentage">{report.matchScore}</text>
                  <text x="18" y="24" className="percent-symbol">%</text>
                </svg>
              </div>
            </div>
            <p className="match-status">Strong match for this role</p>
          </div>

          <hr className="divider" />

          <div className="skill-gaps-section">
            <p className="section-title">SKILL GAPS</p>
            <div className="gap-list">
              {report.skillGaps.map((gap, index) => {
                let severityClass = gap.severity || 'low';
                return (
                  <div key={index} className={`gap-card ${severityClass}`}>
                    {gap.skill}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="download-section">
            <button className="download-btn"
            onClick={()=>{getResumePdf(interviewId)}}>
              <DownloadIcon /> Download AI Generated Resume
            </button>
          </div>
        </aside>

      </div>
    </main>
  );
};

export default Interview;