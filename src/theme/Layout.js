// Layout.js
import React, { useEffect, useState } from 'react';
import { useDarkMode } from './Darkmode';
import StyledIconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useSelector } from 'react-redux';
import LoadingBar from 'react-top-loading-bar';

function Layout({ children }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const userUUID = useSelector((state) => state.useruuid.uuid);
  console.log('userUUID mode ad', userUUID);

  const MAX_RETRIES = 3;

  useEffect(() => {
    const fetchInitialDarkModeStatus = async () => {
      setLoading(true);
      try {
        let response;
        for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
          response = await fetch(`http://localhost:8080/api/user/profiles/${userUUID}/mode`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const initialDarkModeValue = data.darkMode === 1;

            toggleDarkMode(initialDarkModeValue);
            setInitialLoad(true);
            break;
          } else {
            console.error('Error fetching initial dark mode status:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching initial dark mode status:', error);
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    if (!initialLoad) {
      setProgress(30);
      fetchInitialDarkModeStatus();
    }
  }, [userUUID, toggleDarkMode, initialLoad]);

  useEffect(() => {
    // Save dark mode preference to local storage
    localStorage.setItem('darkMode', isDarkMode ? '1' : '0');
  }, [isDarkMode]);

  const handleDarkModeToggle = async () => {
    setLoading(true);
    try {
      let response;
      for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
        response = await fetch(`http://localhost:8080/api/user/profiles/${userUUID}/mode`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ darkMode: !isDarkMode ? 1 : 0 }),
        });

        if (response.ok) {
          const data = await response.json();
          toggleDarkMode(data.darkMode === 1);
          return data.darkMode;
        } else {
          console.error('Error updating dark mode:', response.statusText);
        }
      }

      console.error('Max retries reached. Unable to update dark mode.');
      return null;

    } catch (error) {
      console.error('Error updating dark mode:', error);
      return null;
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <LoadingBar color="#f11946" progress={progress} height={3} />
      <StyledIconButton color="inherit" onClick={handleDarkModeToggle} className="dark-mode-toggle-button">
        {isDarkMode ?
          <Brightness7Icon style={{ color: '#FFFFFF' }} /> : // Set color for dark mode
          <Brightness4Icon style={{ color: '#000000' }} />   // Set color for light mode
        }
      </StyledIconButton>
      {children}
    </div>
  );
}

export default Layout;
