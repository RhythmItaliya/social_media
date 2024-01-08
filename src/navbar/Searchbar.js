import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useDarkMode } from '../theme/Darkmode';

const lightModeColors = {
  backgroundColor: '#ffffff',
  searchBarColor: '#ffffff',
  iconColor: 'rgb(0,0,0)',
  placeholderColor: 'rgb(0,0,0)',
  inputTextColor: 'rgb(0,0,0)',
  focusColor: 'rgb(0,0,0)',
  border: '#CCCCCC',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
};

const darkModeColors = {
  backgroundColor: 'rgb(0,0,0)',
  searchBarColor: 'rgb(0,0,0)',
  iconColor: 'rgb(0,0,0)',
  placeholderColor: '#ffffff',
  inputTextColor: 'rgb(0,0,0)',
  focusColor: '#ffffff',
  border: '#333333',
  boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.isDarkMode ? darkModeColors.searchBarColor : lightModeColors.searchBarColor, 0.9),
  border: `1px solid ${theme.isDarkMode ? darkModeColors.border : lightModeColors.border}`,
  '&:hover': {
    backgroundColor: alpha(theme.isDarkMode ? darkModeColors.searchBarColor : lightModeColors.searchBarColor, 1),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    margin: 'auto',
    width: '50%',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.isDarkMode ? darkModeColors.inputTextColor : lightModeColors.inputTextColor,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      '&:focus': {
        width: '100%',
        color: theme.isDarkMode ? darkModeColors.focusColor : lightModeColors.focusColor,
      },
    },
    '&::placeholder': {
      color: theme.isDarkMode ? darkModeColors.placeholderColor : lightModeColors.placeholderColor,
    },
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function SearchAppBar() {
  const { isDarkMode } = useDarkMode();

  return (
    <Box sx={{
      flexGrow: 1,
    }}>
      <AppBar position="static" sx={{
        backgroundColor: isDarkMode ? darkModeColors.backgroundColor : lightModeColors.backgroundColor,
        borderBottom: `1px solid ${isDarkMode ? darkModeColors.border : lightModeColors.border}`,
        boxShadow: isDarkMode ? darkModeColors.boxShadow : lightModeColors.boxShadow,
      }}>
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: isDarkMode ? darkModeColors.iconColor : lightModeColors.iconColor }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
