import React, { useRef, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useDarkMode } from '../theme/Darkmode';
import { Avatar } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import CircularProgress from '@mui/material/CircularProgress';
import './Merger.css';


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
    searchBarColor: '#ffffff',
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
    searchBarColor: 'rgb(0,0,0)',
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
            const response = await fetch(`http://localhost:8080/search/${searchTerm}`);
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
            />
        </Box>
    );
};


export default SearchAppBar;


const SearchOverlay = ({ searchTerm, searchResults, loading, error, colors }) => {
    const showBorder = searchResults.length > 0;
    const defaultImageUrl = 'https://robohash.org/yourtext.png';

    return (
        <div
            className='searchOverlay d-flex justify-content-center align-content-center'
            style={{
                border: showBorder ? `1px solid rgba(${hexToRgb(colors.border)}, 0.7)` : 'none',
            }}
        >
            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress style={{ color: 'red' }} />
                </div>
            )}


            {error && (
                <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <div className='d-flex mt-3 flex-column'>
                    {searchResults.map((user) => (
                        <div
                            key={user.uuid}
                            className='d-flex gap-3 m-1 p-2 rounded-2'
                            style={{
                                cursor: 'pointer',
                            }}
                        >
                            <div className="d-flex justify-content-center align-content-center">
                                {user.userProfile && user.userProfile.profilePhote && (
                                    <Avatar
                                        src={!user.userProfile || !user.userProfile.profilePhote ? defaultImageUrl : `http://static.profile.local/${user.userProfile.profilePhote.photoURL}`}
                                        alt={`Profile of ${user.username}`}
                                        style={{
                                            width: '42px',
                                            height: '42px',
                                        }}
                                    />
                                )}
                            </div>
                            <div>
                                <div className="flex-column justify-content-start align-items-center">
                                    <div className="pointer-event" style={{ fontSize: "14px", color: colors.textColor, fontWeight: '500' }}>
                                        {user.userProfile && user.userProfile.firstName && (
                                            user.userProfile.firstName.charAt(0).toUpperCase() + user.userProfile.firstName.slice(1)
                                        )}{' '}
                                        {user.userProfile && user.userProfile.lastName && (
                                            user.userProfile.lastName.charAt(0).toUpperCase() + user.userProfile.lastName.slice(1)
                                        )}{' '}
                                    </div>
                                    <div className='pointer-event' style={{ fontSize: '12px', color: colors.labelColor }}>
                                        {user.username && `@${user.username}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && searchResults.length === 0 && searchTerm && (
                <p style={{ color: colors.textColor, textAlign: 'center', padding: '20px' }}>No matching users found</p>
            )}
        </div>
    );
};
