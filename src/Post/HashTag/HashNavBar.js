import React, { useState } from 'react';
import { Avatar, Input, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import logoImage from '../../assets/vortex.png';
import { useSelector } from 'react-redux';
import { Search } from '@mui/icons-material';


const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const HashNavBar = ({ colors }) => {

    const { hashtag } = useParams();
    const [inputValue, setInputValue] = useState('');

    const navigate = useNavigate();
    // Logo
    const setLogo = useSelector((state) => state.userPhoto.photoUrl);

    // Username
    const username = useSelector((state) => state.name.username);

    const handleChange = (event) => {
        const value = event.target.value;
        if (/^[a-zA-Z0-9]*$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleSearch = () => {
        if (inputValue.trim() !== '') {
            navigate(`/hashtags/${inputValue}`);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: colors.backgroundColor, zIndex: 1000, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px' }}>

                <div className='d-flex justify-content-center align-content-center'>
                    <Link to={'/home'}>
                        <img src={logoImage} alt="Logo" style={{ width: '150px', height: 'auto', borderRadius: '5px' }} />
                    </Link>
                </div>

                <div className='d-flex align-items-center gap-3'>
                    <h3 style={{ color: colors.textColor, fontSize: `calc(12px + 1vw)`, margin: 0 }}>#{hashtag}</h3>
                    <Input
                        style={{
                            color: colors.textColor,
                            backgroundColor: colors.backgroundColor,
                            border: `1px solid ${colors.border}`,
                            padding: '8px',
                            resize: 'none',
                            flex: 1,
                            '&:focus': {
                                borderColor: colors.focusColor,
                            },
                            '@media (max-width: 768px)': {
                                width: '70%',
                            },
                            '@media (max-width: 576px)': {
                                width: '50%',
                            },
                        }}
                        value={inputValue}
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        endAdornment={
                            <Search
                                style={{
                                    fontSize: 'calc(12px + 1vw)',
                                    cursor: 'pointer'
                                }}
                                onClick={handleSearch}
                            />
                        }
                    />
                </div>

                <div className='d-flex justify-content-center align-items-center gap-3'>
                    <Typography sx={{ color: colors.textColor, fontSize: '18px' }}>
                        {username}
                    </Typography>

                    <Avatar
                        alt={`${username}`}
                        src={setLogo}
                        style={{
                            width: '40px',
                            height: '40px'
                        }}
                    />
                </div>
            </div>
        </nav>
    );
};

export default HashNavBar;
