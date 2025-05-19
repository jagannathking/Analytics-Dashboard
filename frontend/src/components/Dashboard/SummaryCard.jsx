import React from 'react';
import './SummaryCard.css';
// import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'; // Example for trend icons

const SummaryCard = ({ title, value, subValue, isLoading, icon, trendDirection, trendValue }) => {
  if (isLoading) {
    return (
      <div className="summary-card card loading-placeholder">
        <div className="placeholder-title"></div>
        <div className="placeholder-value"></div>
        {subValue !== undefined && <div className="placeholder-subvalue"></div>}
      </div>
    );
  }

  return (
    <div className="summary-card card">
      {icon && <div className="summary-card-icon">{icon}</div>}
      <div className="summary-card-content">
        <h3 className="summary-card-title">{title}</h3>
        <p className="summary-card-value">{value}</p>
        {subValue !== undefined && <p className="summary-card-subvalue">{subValue}</p>}
        {trendValue && (
          <div className={`summary-card-trend trend-${trendDirection || 'neutral'}`}>
            {/* {trendDirection === 'up' && <ArrowUpIcon />}
            {trendDirection === 'down' && <ArrowDownIcon />} */}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;