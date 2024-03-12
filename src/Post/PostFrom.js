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
import { message } from 'antd';
import LocationPicker from './LocationPicker';

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

const initialState = {
    caption: '',
    postText: '',
    location: { city: null, country: null },
    hashtags: [],
    newHashtag: '',
    addedHashtags: [],
    validationMessage: '',
    isPublic: true,
};

const PostForm = () => {
    const profileUUID = useSelector(state => state.profileuuid.uuid);
    const postBase64 = useSelector(state => state.post.base64Data);
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [formState, setFormState] = useState(initialState);

    const {
        caption,
        postText,
        location,
        hashtags,
        newHashtag,
        addedHashtags,
        validationMessage,
        isPublic,
    } = formState;

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

    const toggleVisibility = () => {
        setFormState(prevState => ({ ...prevState, isPublic: !prevState.isPublic }));
    };

    const handleAddHashtag = () => {
        if (newHashtag) {
            const lowercaseHashtag = newHashtag.toLowerCase();
            setFormState(prevState => ({
                ...prevState,
                hashtags: [...prevState.hashtags, lowercaseHashtag],
                addedHashtags: [...prevState.addedHashtags, lowercaseHashtag],
                newHashtag: '',
            }));
        }
    };

    const handleRemoveHashtag = removedHashtag => {
        setFormState(prevState => ({
            ...prevState,
            addedHashtags: prevState.addedHashtags.filter(tag => tag !== removedHashtag),
            hashtags: prevState.hashtags.filter(tag => tag !== removedHashtag),
        }));
    };

    const handleLocationChange = ({ city, country }) => {
        setFormState(prevState => ({ ...prevState, location: { city, country } }));
    };

    const resetForm = () => {
        setFormState(initialState);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!postBase64) {
            setFormState(prevState => ({ ...prevState, validationMessage: 'Please upload or save an image.' }));
            return;
        }

        try {
            startLoading();
            setTimeout(async () => {
                resetForm();

                message.success({
                    content: 'Post uploaded successfully!',
                    duration: 3,
                });

                finishLoading();
            }, 1000);
        } catch (error) {
            // Handle error
            message.error({
                content: 'Failed to upload post. Please try again.',
                duration: 3,
            });
            console.error('Error creating post:', error.message);

            finishLoading();
        }
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: colors.backgroundColor }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>

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
                            onChange={(e) => setFormState(prevState => ({ ...prevState, caption: e.target.value }))}
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
                            onChange={(e) => setFormState(prevState => ({ ...prevState, postText: e.target.value }))}
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

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="New Hashtag"
                            variant="standard"
                            size="small"
                            value={newHashtag}
                            onChange={(e) => setFormState(prevState => ({ ...prevState, newHashtag: e.target.value }))}
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

                    <Grid item container spacing={1} alignItems="center" xs={12}>
                        {addedHashtags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.startsWith('#') ? tag : `#${tag}`}
                                onDelete={() => handleRemoveHashtag(tag)}
                                color="primary"
                            />
                        ))}
                    </Grid>

                    <Grid item container spacing={2} alignItems="center" xs={12}>
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
                        setValidationMessage={(message) => setFormState(prevState => ({ ...prevState, validationMessage: message }))}
                        setLocation={(location) => setFormState(prevState => ({ ...prevState, location }))}
                    />

                    <Grid item container spacing={2} alignItems="center" xs={12}>
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
