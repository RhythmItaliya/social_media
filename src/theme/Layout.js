import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../actions/authActions'; 

import StyledIconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import config from '../configuration';

function Layout({ children }) {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode); 
  const userUUID = useSelector((state) => state.useruuid.uuid);
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialDarkModeStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.apiUrl}/darkmode/api/user/profiles/${userUUID}/mode`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const initialDarkModeValue = data.darkMode;

          dispatch(toggleDarkMode(initialDarkModeValue));
          setInitialLoad(true);

        } else {
          console.error('Error fetching initial dark mode status:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching initial dark mode status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialLoad) {
      fetchInitialDarkModeStatus();
    }
  }, [userUUID, dispatch, initialLoad]);

  const handleDarkModeToggle = async () => {
    setLoading(true);
    try {
      const newDarkMode = !isDarkMode;
      dispatch(toggleDarkMode(newDarkMode));

      const response = await fetch(`${config.apiUrl}/darkmode/api/user/profiles/${userUUID}/mode`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ darkMode: newDarkMode }),
      });

      if (!response.ok) {
        console.error('Error updating dark mode:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating dark mode:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <StyledIconButton color="inherit" onClick={handleDarkModeToggle} className="dark-mode-toggle-button">
        {isDarkMode ?
          <Brightness7Icon style={{ color: '#FFFFFF' }} /> :
          <Brightness4Icon style={{ color: '#000000' }} />
        }
      </StyledIconButton>
      {loading && <p></p>}
      {children}
    </div>
  );
}

export default Layout;
