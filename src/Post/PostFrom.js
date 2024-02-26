import React, { useState, useRef } from 'react';
import { TextField, IconButton, Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Chip, TextareaAutosize } from '@material-ui/core';
import { useDarkMode } from '../theme/Darkmode';
import LoadingBar from 'react-top-loading-bar';
import './post.css';
import { message } from 'antd';
import LocationPicker from './LocationPicker';
import { useNavigate } from 'react-router-dom';
import './otherpost.css';

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

    const [caption, setCaption] = useState('');
    const [postText, setPostText] = useState('');
    const [location, setLocation] = useState({ city: null, country: null });
    const [hashtags, setHashtags] = useState([]);
    const [newHashtag, setNewHashtag] = useState('');
    const [addedHashtags, setAddedHashtags] = useState([]);

    const [validationMessage, setValidationMessage] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const [loading, setLoading] = useState(false);

    const ref = useRef(null);

    const startLoading = () => {
        setLoading(true);
        ref.current.continuousStart();
    };

    const finishLoading = () => {
        setLoading(false);
        ref.current.complete();
    };

    const navigate = useNavigate();

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

    const handleLocationChange = ({ city, country }) => {
        setLocation({ city, country });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postBase64) {
            setValidationMessage('Please upload or save an image.');
            return;
        }
        try {
            startLoading();

            const response = await fetch(`http://localhost:8080/api/posts`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userProfileId: profileUUID,
                    postText,
                    caption,
                    location: JSON.stringify([location.country, location.city]),
                    isVisibility: isPublic ? '0' : '1',
                    data: postBase64,
                    hashtags: JSON.stringify(hashtags),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            const responseData = await response.json();
            console.log('Post created successfully:', responseData);
            message.success({
                content: 'Post uploaded successfully!',
                duration: 3,
            });

            // navigate('./home');
        } catch (error) {

            message.error({
                content: 'Failed to upload post. Please try again.',
                duration: 3,
            });
            console.error('Error creating post:', error.message);
        } finally {
            finishLoading();
        }
    };


    return (
        <Container maxWidth="sm" style={{ backgroundColor: colors.backgroundColor }}>

            <form onSubmit={handleSubmit}>

                <Grid className='mt-1' container spacing={2}>

                    <Grid item xs={12}>
                        {validationMessage && (
                            <p style={{ color: 'red' }}>{validationMessage}</p>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Caption"
                            variant="standard"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
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



                    <Grid item xs={12}>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Post Text"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            style={{
                                color: colors.textColor,
                                backgroundColor: colors.backgroundColor,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '4px',
                                padding: '8px',
                                width: '100%',
                                marginTop: '8px',
                                resize: 'none',
                                '&:focus': {
                                    borderColor: colors.focusColor,
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
                                label={tag.startsWith('#') ? tag : `#${tag}`}
                                onDelete={() => handleRemoveHashtag(tag)}
                                color="primary"
                                style={{
                                    // backgroundColor: isDarkMode ? darkModeColors.backgroundColor : lightModeColors.backgroundColor,
                                    // color: isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
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



                    <LocationPicker
                        onLocationChange={handleLocationChange}
                        setValidationMessage={setValidationMessage}
                        setLocation={setLocation}
                    />


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
                                        fontSize: '16px',
                                        margin: '10px'
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
            <LoadingBar color={isDarkMode ? darkModeColors.spinnerColor : lightModeColors.spinnerColor} ref={ref} />

        </Container>
    );
};

export default PostForm;