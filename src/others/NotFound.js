// NotFound.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../theme/Darkmode';

const lightModeColors = {
  backgroundColor: '#ffffff',
  textColor: 'rgb(0,0,0)',
};

const darkModeColors = {
  backgroundColor: 'rgb(0,0,0)',
  textColor: '#ffffff',
};

const NotFound = () => {
  const navigate = useNavigate();

  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <div>
        <h1 style={{ color: colors.textColor, textAlign: 'center' }}>404 - Not Found</h1>
      </div>
    </>
  );
};

export default NotFound;