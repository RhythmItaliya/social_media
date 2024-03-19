import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useDarkMode } from '../theme/Darkmode';
import LoadingBar from 'react-top-loading-bar';
import './Merger.css';

import SearchOverlay from './SearchOverlay';
import config from '../configuration';
import { useSelector } from 'react-redux';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
    labelColor: '#8e8e8e',
    valueTextColor: 'rgb(0,0,0)',
    linkColor: '#000',
    hashtagColor: 'darkblue',
    transparentColor: 'rgba(255, 255, 255, 0.5)'
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff',
    labelColor: '#CCC',
    valueTextColor: '#ffffff',
    linkColor: '#CCC8',
    hashtagColor: '#8A2BE2',
    transparentColor: 'rgba(255, 255, 255, 0.5)'
};


const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid rgba(${hexToRgb(theme.isDarkMode ? darkModeColors.border : lightModeColors.border)}, 0.7)`,
    color: theme.isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        margin: 'auto',
        width: '50%',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    border: `1px solid rgba(${hexToRgb(theme.isDarkMode ? darkModeColors.border : lightModeColors.border)}, 0.7)`,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
        '&::placeholder': {
            color: theme.isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
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
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadingBarRef = useRef(null);
    const profileUUID = useSelector((state) => state.profileuuid.uuid);


    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
        }

        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setLoading(false);

            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }

            return;
        }
        try {
            const response = await fetch(`${config.apiUrl}/search/search/${searchTerm}`);
            const data = await response.json();

            if (data.success) {
                setSearchResults(data.users);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('An error occurred while fetching results. Please try again.');
        } finally {
            setLoading(false);

            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
        }
    };

    const handleChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);

        if (newSearchTerm.trim() !== '') {
            handleSearch();
        } else {
            setSearchResults([]);
        }
    };


    const handleCloseOverlay = () => {
        setSearchResults([]);
    };


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{
                backgroundColor: colors.backgroundColor,
                borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
            }}>
                <Toolbar>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon
                                sx={{
                                    color: colors.iconColor,
                                }} />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchTerm}
                            onChange={handleChange}
                            sx={{
                                color: colors.textColor,
                            }}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <LoadingBar color={colors.spinnerColor} ref={loadingBarRef} />
            <SearchOverlay
                searchTerm={searchTerm}
                searchResults={searchResults}
                loading={loading}
                error={error}
                colors={colors}
                onClose={handleCloseOverlay}
            />
        </Box>
    );
};


export default SearchAppBar;