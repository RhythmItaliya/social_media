import React, { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import './others.css';

const LoadingSpinner = () => {
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);

  return (
    <>
      <LoadingBar
        progress={loadingBarProgress}
        height={3}
        color="#f11946"
        onLoaderFinished={() => setLoadingBarProgress(0)}
      />
    </>
  );
};

export default LoadingSpinner;
