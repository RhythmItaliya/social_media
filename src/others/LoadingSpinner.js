// LoadingSpinner.js

import React from 'react';
import { Spin } from 'antd';
import './others.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <Spin size="large" className="loading-spinner" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
