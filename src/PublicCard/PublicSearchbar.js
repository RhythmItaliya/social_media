import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import LoadingBar from 'react-top-loading-bar';
import '../navbar/Merger.css';
import SearchOverlay from '../navbar/SearchOverlay';
import config from '../configuration';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../theme/Darkmode';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    border: '#333333',
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    border: `1px solid rgba(${hexToRgb(theme.isDarkMode ? darkModeColors.border : lightModeColors.border)}, 0.7)`,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
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

const PublicSearchbar = () => {
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
        <Search className='w-50 mx-auto'>
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
            <LoadingBar color="#ec1b90" ref={loadingBarRef} />
            <SearchOverlay
                searchTerm={searchTerm}
                searchResults={searchResults}
                loading={loading}
                error={error}
                colors={colors}
                onClose={handleCloseOverlay}
            />
        </Search>
    );
};

export default PublicSearchbar;
