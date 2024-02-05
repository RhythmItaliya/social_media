import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Container } from '@mui/material';
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import { GiHeartKey } from 'react-icons/gi';
import { GiBrokenSkull } from 'react-icons/gi';
import Tooltip from "@mui/material/Tooltip";
import { useDarkMode } from '../theme/Darkmode';

import PublicPost from './PublicPost';

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

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const PublicCard = ({ uuid, profileUUID, username, photoURL }) => {
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;
    const [userData, setUserData] = useState(null);
    const [postCount, setPostCount] = useState(0);
    const [friendCount, setFriendPostCount] = useState(0);
    const [userBio, setUserBio] = useState('');

    const defaultImageUrl = 'https://robohash.org/yourtext.png';


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/users/${uuid}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Request failed');
                    throw new Error('Request failed');
                }

                const data = await response.json();
                setUserData({
                    firstName: data.userProfile.firstName,
                    lastName: data.userProfile.lastName,
                    location: data.userProfile.location,
                });
                setUserBio(data.userProfile.bio || '');
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [uuid]);

    useEffect(() => {
        const fetchUserPostCount = async () => {
            try {
                const postCountResponse = await fetch(`http://localhost:8080/api/userPostsCount/${profileUUID}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!postCountResponse.ok) {
                    console.error('Failed to fetch post count');
                    throw new Error('Failed to fetch post count');
                }

                const postData = await postCountResponse.json();
                setPostCount(postData.postCount);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserPostCount();
    }, [profileUUID]);

    useEffect(() => {
        const fetchFriendCount = async () => {
            try {
                const friendCountResponse = await fetch(`http://localhost:8080/api/friendships/count/${profileUUID}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!friendCountResponse.ok) {
                    console.error('Failed to fetch friend count');
                    throw new Error('Failed to fetch friend count');
                }

                const postfriendData = await friendCountResponse.json();
                setFriendPostCount(postfriendData.friendshipCount);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFriendCount();
    }, [profileUUID]);

    const handleAddToFriend = () => {
        console.log("Add to Friend clicked");
    };

    const handleMessage = () => {
        console.log("Message clicked");
    };

    const handleAddToCrush = () => {
        console.log("Add to Crush clicked");
    };

    const handleAddToIgnore = () => {
        console.log("Add to Ignore clicked");
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <Container maxWidth="sm" style={{ border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
            {/* profile div */}
            <div className='gap-3' style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'space-around', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }}>
                <div className='p-3 m-0 rounded-2'>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item>
                            <Avatar
                                src={`http://static.profile.local/${photoURL || defaultImageUrl}`}
                                alt="Profile Avatar"
                                style={{ width: '100px', height: '100px' }}
                            />
                        </Grid>

                        <Grid item>
                            {userData && (
                                <Typography style={{ color: colors.textColor, fontSize: "18px" }}>
                                    {`${capitalizeFirstLetter(userData.firstName)} ${capitalizeFirstLetter(userData.lastName)}`}
                                </Typography>
                            )}

                            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                <AlternateEmailIcon style={{ color: colors.iconColor, fontSize: "16px" }} />
                                <Typography style={{ fontSize: "14px", color: colors.labelColor }}>
                                    {username}
                                </Typography>
                            </div>

                            {userData && (
                                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                    <LocationOnIcon style={{ color: colors.iconColor, fontSize: "14px" }} />
                                    <Typography style={{ fontSize: "10px", color: colors.labelColor }}>
                                        {userData.location}
                                    </Typography>
                                </div>
                            )}
                        </Grid>

                        <Grid item>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>{postCount}</Typography>
                                <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                                    Post
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>

            {/* count div */}
            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px', marginBottom: '10px' }}>
                <Grid item className='d-flex gap-4 p-3'>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ fontSize: '30px', color: colors.textColor }}>50</Typography>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor }}>
                            Ratting
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>{friendCount}</Typography>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                            Friend
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>50</Typography>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                            Crush Keys
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>50</Typography>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                            Ignore
                        </Typography>
                    </div>
                </Grid>
            </div>

            {/* Button div */}
            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px', marginBottom: '10px' }}>
                <Grid container justifyContent="space-around">
                    <Tooltip style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} title="Add to Friend" arrow>
                        <IconButton style={{ color: colors.iconColor }} onClick={handleAddToFriend}>
                            <PersonAddIcon style={{ color: colors.iconColor }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} title="Message" arrow>
                        <IconButton style={{ color: colors.iconColor }} onClick={handleMessage}>
                            <MessageIcon style={{ color: colors.iconColor }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} title="Crush" arrow>
                        <IconButton style={{ color: colors.iconColor }} onClick={handleAddToCrush}>
                            <GiHeartKey style={{ color: colors.iconColor }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} title="Ignore" arrow>
                        <IconButton style={{ color: colors.iconColor }} onClick={handleAddToIgnore}>
                            <GiBrokenSkull style={{ color: colors.iconColor }} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </div>

            {/* Bio div */}
            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px' }}>
                <Typography style={{ fontSize: "14px", color: colors.textColor, padding: '10px' }}>
                    {userBio}
                </Typography>
            </div>

            {/* post div */}
            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Grid>
                    <PublicPost profileUUID={profileUUID} />
                </Grid>
            </div>
        </Container>
    );
}


export default PublicCard;