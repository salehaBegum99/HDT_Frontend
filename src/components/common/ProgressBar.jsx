import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ value = 0, max = 100, label, showLabel = true, color = 'primary' }) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="progress-bar">
      <div className={`progress-bar__track progress-bar__track--${color}`}>
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
      {showLabel && (
        <span className="progress-bar__label">{percentage}% Completed</span>
      )}
    </div>
  );
};

export default ProgressBar;
