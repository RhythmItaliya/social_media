import React, { useState, useRef, useEffect } from 'react';
import { TextField, IconButton, Container, Grid, LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Chip, TextareaAutosize } from '@material-ui/core';
import { useDarkMode } from '../theme/Darkmode';
import LoadingBar from 'react-top-loading-bar';
import { message } from 'antd';
import LocationPicker from './LocationPicker';
import { removePostBase64 } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

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

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

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
        setFormState(prevState => ({
            ...prevState,
            validationMessage: '',
            postBase64: '',
        }));
    };

    useEffect(() => {
        const cleanup = () => {
            dispatch(removePostBase64());
        };

        window.addEventListener('beforeunload', cleanup);

        return () => {
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [dispatch]);

    // API_UPLOAD
    const handleSubmit = async e => {

        e.preventDefault();

        if (!postBase64) {
            setFormState(prevState => ({ ...prevState, validationMessage: 'Please upload or save an image.' }));
            return;
        }

        try {

            setLoading(true);
            const intervals = [10, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100];
            for (const interval of intervals) {
                await simulateUpload(interval);
                setUploadProgress(interval);
            }

            const response = await fetch(`http://localhost:8080/api/create/posts/${profileUUID}`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: postBase64,
                    postText: postText,
                    caption: caption,
                    location: JSON.stringify(location),
                    isVisibility: isPublic ? '1' : '0',
                    hashtags: JSON.stringify(hashtags),
                }),
                onUploadProgress: progressEvent => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                }
            });
            const data = await response.json();

            resetForm();

            dispatch(removePostBase64());

            message.success({
                content: 'Post Upload Successfully.',
                duration: 3,
            });

            navigate('/post');
        } catch (error) {
            message.error({
                content: 'Failed to upload post. Please try again.',
                duration: 3,
            });
            console.error('Error creating post:', error.message);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const simulateUpload = (interval) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, interval);
        });
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
                                style={{ color: colors.iconColor, borderRadius: 0 }}
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

                {loading && (
                    <div>
                        <p style={{ color: colors.textColor }}>Uploading: {uploadProgress}%</p>
                        <LinearProgress style={{ color: colors.textColor }} variant="determinate" value={uploadProgress} />
                    </div>
                )}

            </form>
            <LoadingBar color={isDarkMode ? darkModeColors.spinnerColor : lightModeColors.spinnerColor} ref={ref} />
        </Container>
    );
};

export default PostForm;