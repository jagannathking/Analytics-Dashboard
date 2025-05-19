import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = false, message = "Loading..." }) => {
  return (
    <div className={`spinner-container ${fullPage ? 'full-page-spinner' : ''}`}>
      <div className="spinner"></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;