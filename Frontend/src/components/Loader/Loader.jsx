import React from 'react';
import './loader.scss';

const Loader = ({ message, subtext }) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner">
        <div className="circle"></div>
        <div className="orb"></div>
      </div>
      <div className="loader-content">
        <h1 className="loader-text">{message || 'AI is working...'}</h1>
        <p className="loader-subtext">
          {subtext || 'Please wait while we process your request using advanced AI algorithms.'}
        </p>
      </div>
    </div>
  );
};

export default Loader;
