import React from 'react';
import "../style/home.scss";
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../../../components/Navbar/Navbar';

const Home = () => {
  
  const {loginWithRedirect} = useAuth0();

  const handleGoogleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: '/dashboard',
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Master Your Next Interview with AI</h1>
        <p>
          Get personalized interview preparation, real-time feedback, and 
          comprehensive reports to boost your confidence and land your dream job.
        </p>
        <div className="hero-btns">
          <button className="primary-btn" onClick={(e) => handleGoogleLogin()}>Get Started for Free</button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-title">
          <h2>Key Features</h2>
          <p>Everything you need to excel in your technical and behavioral interviews.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-box">🎯</div>
            <h3>Smart Match Analysis</h3>
            <p>Compare your resume against job descriptions to identify key skill gaps and optimization areas.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">🤖</div>
            <h3>AI Mock Interviews</h3>
            <p>Practice with our intelligent interviewer that tailors questions based on your specific job role.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">📊</div>
            <h3>Performance Insights</h3>
            <p>Receive detailed breakdown of your strengths and weaknesses with actionable preparation plans.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">⚡</div>
            <h3>Confidence Coach</h3>
            <p>Improve your delivery with real-time feedback on your tone, pace, and overall confidence.</p>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why-section">
        <div className="why-container">
          <div className="why-content">
            <h2>Why Use PrepAI?</h2>
            <p>
              Traditional interview prep is outdated. PrepAI uses the latest generative AI 
              to provide an interactive, personalized experience that mimics real interview scenarios.
            </p>
            <ul>
              <li>Refine your pitch with instant feedback</li>
              <li>Practice niche technical topics effortlessly</li>
              <li>Analyze your body language and tone of voice</li>
              <li>Stay ahead of the competition with AI-driven insights</li>
            </ul>
          </div>
          <div className="why-image">
            {/* Image Placeholder */}
            <img src="AI_Image.png" alt="" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <h3>PrepAI</h3>
          <p>© 2026 PrepAI Inc. Elevating Interview Performance.</p>
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
