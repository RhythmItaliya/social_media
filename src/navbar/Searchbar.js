import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useDarkMode } from '../theme/Darkmode';
import { Avatar } from '@mui/material';

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

const SearchAppBar = () => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/search/${searchTerm}`);
      const data = await response.json();

      // Assuming the API response structure includes 'success' and 'users' fields
      if (data.success) {
        setSearchResults(data.users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
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
              value={searchTerm}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
          </Search>
        </Toolbar>
      </AppBar>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className='bg-black'>
          <h2>Search Results:</h2>
          <ul>
            {searchResults.map((user) => (
              <li key={user.uuid}>
                {user.username} - {user.userProfile && user.userProfile.firstName} {user.userProfile && user.userProfile.lastName}
                {user.userProfile && user.userProfile.profilePhote && (
                  <Avatar src={`http://static.profile.local/${user.userProfile.profilePhote.photoURL}`} alt={`Profile of ${user.username}`} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display message when no results found */}
      {searchResults.length === 0 && searchTerm && (
        <p>No matching users found</p>
      )}
    </Box>
  );
};

export default SearchAppBar;
