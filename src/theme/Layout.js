// Layout.js
import React from 'react';
import { useDarkMode } from './Darkmode';
import StyledIconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

function Layout({ children }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <StyledIconButton color="inherit" onClick={toggleDarkMode} className="dark-mode-toggle-button">
        {isDarkMode ?
          <Brightness7Icon style={{ color: '#FFFFFF' }} /> :  // Set color for dark mode
          <Brightness4Icon style={{ color: '#000000' }} />    // Set color for light mode
        }
      </StyledIconButton>
      {children}
    </div>
  );
}

export default Layout;
