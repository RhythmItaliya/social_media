import React, { useState } from 'react';
import { TextField, IconButton, Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Chip } from '@material-ui/core';

import { useDarkMode } from '../theme/Darkmode';
import './post.css';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
    labelColor: 'rgb(0,0,0)',
    valueTextColor: 'rgb(0,0,0)',
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
    valueTextColor: '#ffffff'
};

const PostForm = () => {
    const profileUUID = useSelector(state => state.profileuuid.uuid);
    const postBase64 = useSelector(state => state.post.base64Data);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [postText, setPostText] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [newHashtag, setNewHashtag] = useState('');
    const [addedHashtags, setAddedHashtags] = useState([]);

    // New state for visibility
    const [isPublic, setIsPublic] = useState(true);

    // Function to toggle visibility
    const toggleVisibility = () => {
        setIsPublic(prevIsPublic => !prevIsPublic);
    };

    const handleAddHashtag = () => {
        if (newHashtag) {
            const lowercaseHashtag = newHashtag.toLowerCase();
            setHashtags(prevHashtags => [...prevHashtags, lowercaseHashtag]);
            setAddedHashtags(prevAddedHashtags => [...prevAddedHashtags, lowercaseHashtag]);
            setNewHashtag('');
        }
    };

    const handleRemoveHashtag = (removedHashtag) => {
        setAddedHashtags(prevAddedHashtags => prevAddedHashtags.filter(tag => tag !== removedHashtag));
        setHashtags(prevHashtags => prevHashtags.filter(tag => tag !== removedHashtag));
    };

    const handleLocationClick = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setLocation({ lat: latitude, lng: longitude });

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();

                        if (data.address) {
                            const cityValue = data.address.city || data.address.town || data.address.village;
                            const countryValue = data.address.country;

                            setCity(cityValue);
                            setCountry(countryValue);
                        }
                    } catch (error) {
                        console.error('Error getting location information:', error.message);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/posts`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userProfileUuid: profileUUID,
                    postText,
                    location,
                    hashtags,
                    data: postBase64,
                    city,
                    country,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const responseData = await response.json();
            console.log('Post created successfully:', responseData);
        } catch (error) {
            console.error('Error creating post:', error.message);
        }
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: colors.backgroundColor }}>
            <form onSubmit={handleSubmit}>

                <Grid className='mt-1' container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Caption"
                            variant="standard"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            InputProps={{
                                style: {
                                    color: colors.textColor,
                                    borderBottom: `1px solid ${colors.border}`,
                                    '&:focus': {
                                        color: colors.focusColor,
                                    },
                                },
                            }}
                            InputLabelProps={{
                                style: {
                                    color: colors.labelColor,
                                },
                            }}
                        />
                    </Grid>



                    <Grid className='mt-1' item container spacing={2} alignItems="center" xs={12}>
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                label="New Hashtag"
                                variant="standard"
                                size="small"
                                value={newHashtag}
                                onChange={(e) => setNewHashtag(e.target.value)}
                                InputProps={{
                                    style: {
                                        color: colors.textColor,
                                        borderBottom: `1px solid ${colors.border}`,
                                        '&:focus': {
                                            color: colors.focusColor,
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: colors.labelColor,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={2}>
                            <IconButton
                                type="button"
                                color="primary"
                                onClick={handleAddHashtag}
                                style={{
                                    color: colors.iconColor
                                }}
                            >
                                <AddCircleIcon />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Grid item container spacing={1} alignItems="center" xs={12}>
                        {addedHashtags.map((tag, index) => (
                            <Chip
                                label={`#${tag}`}
                                onDelete={() => handleRemoveHashtag(tag)}
                                color="primary"
                                style={{
                                    backgroundColor: isDarkMode ? darkModeColors.backgroundColor : lightModeColors.backgroundColor,
                                    color: isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
                                }}
                            />

                        ))}
                    </Grid>


                    <Grid className='mt-1' item container spacing={2} alignItems="center" xs={12}>
                        <Grid item xs={10}>
                            <div
                                style={{
                                    borderBottom: `1px solid ${colors.border}`,
                                }}>
                                <p
                                    style={{
                                        color: colors.labelColor,
                                    }}
                                >Visibility</p>

                                <span style={{ color: colors.textColor, marginLeft: '8px' }}>
                                    {isPublic ? 'Public' : 'Private'}
                                </span>
                            </div>
                        </Grid>

                        <Grid item xs={2}>
                            <IconButton
                                type="button"
                                color="primary"
                                onClick={toggleVisibility}
                                style={{
                                    color: colors.iconColor,
                                }}
                            >
                                {isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                        </Grid>
                    </Grid>



                    <Grid className='mt-1' item container spacing={2} alignItems="center" xs={12}>
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                label="Location"
                                variant="standard"
                                value={`City : ${city} , Country :${country}`}
                                InputProps={{
                                    style: {
                                        color: colors.textColor,
                                        borderBottom: `1px solid ${colors.border}`,
                                        '&:focus': {
                                            color: colors.focusColor,
                                        },
                                    }
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: colors.labelColor,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                type="button"
                                color="primary"
                                onClick={handleLocationClick}
                                style={{ color: colors.iconColor }}
                            >
                                <LocationOnIcon />
                            </IconButton>
                        </Grid>
                    </Grid>



                    <Grid className='mb-5' item container spacing={2} alignItems="center" xs={12}>
                        <Grid item xs={12}>
                            <IconButton

                                type="submit"
                                color="primary"
                                style={{ color: colors.iconColor }}
                            >
                                <span
                                    style={{ 
                                        color: colors.labelColor,
                                        fontSize:'16px',   
                                        margin:'10px'                           
                                     }}
                                >
                                    POST
                                </span>
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default PostForm;