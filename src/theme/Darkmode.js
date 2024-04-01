import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../actions/authActions';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkModeContext = () => {
    dispatch(toggleDarkMode(!isDarkMode));
  };

  const theme = {
    isDarkMode,
    toggleDarkMode: toggleDarkModeContext,
  };

  return (
    <DarkModeContext.Provider value={theme}>{children}</DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};
