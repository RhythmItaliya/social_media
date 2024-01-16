import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControlLabel, Checkbox, Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

const PostForm = () => {
    const profileUUID = useSelector(state => state.profileuuid.uuid);
    const postBase64 = useSelector(state => state.post.base64Data);
    console.log(postBase64);

    const [userProfileId, setUserProfileId] = useState(profileUUID || '');

    const [postText, setPostText] = useState('');
    const [isPhoto, setIsPhoto] = useState(false);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [isVisibility, setIsVisibility] = useState(false);
    const [hashtags, setHashtags] = useState('');


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
                    userProfileUuid: userProfileId,
                    postText,
                    caption,
                    location,
                    isVisibility,
                    hashtags,
                    data: postBase64,
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
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="User Profile ID"
                            variant="outlined"
                            value={userProfileId}
                            onChange={(e) => setUserProfileId(e.target.value)}
                            disabled // to prevent user input
                        />
                    </Grid>
                    {/* Remove local state for base64-encoded data */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Profile UUID (Base64)"
                            variant="outlined"
                            value={postBase64 || ''}
                            // onChange={(e) => setProfileUUIDBase64(e.target.value)}
                            disabled // to prevent user input
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isPhoto}
                                    onChange={(e) => setIsPhoto(e.target.checked)}
                                    name="isPhoto"
                                />
                            }
                            label="Is Photo"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Caption"
                            variant="outlined"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Location"
                            variant="outlined"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isVisibility}
                                    onChange={(e) => setIsVisibility(e.target.checked)}
                                    name="isVisibility"
                                />
                            }
                            label="Is Visible"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Hashtags"
                            variant="outlined"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default PostForm;
