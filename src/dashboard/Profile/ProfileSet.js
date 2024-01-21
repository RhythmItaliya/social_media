import React, { useEffect, useState } from 'react';
import { useDarkMode } from "../../theme/Darkmode";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Container } from '@mui/material';
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PostProfile from './PostProfile';

import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageIcon from "@mui/icons-material/Message";
import { GiHeartKey } from 'react-icons/gi';
import { GiBrokenSkull } from 'react-icons/gi';
import Tooltip from "@mui/material/Tooltip";
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

const ProfileSet = () => {
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;
    const [userData, setUserData] = useState(null);

    // defult imge
    const defaultImageUrl = 'https://robohash.org/yourtext.png';

    //user uuid
    const uuid = useSelector(state => state.useruuid.uuid);

    // userPhotoUrl
    const userPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);

    //username
    const loginUserUsername = useSelector((state) => state.name.username);

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
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [uuid]);

    // API PROFILE PHOTO 

    const handleAddToFriend = () => {
        // Add logic for adding to friend
        console.log("Add to Friend clicked");
    };

    const handleMessage = () => {
        // Add logic for messaging
        console.log("Message clicked");
    };

    const handleAddToCrush = () => {
        // Add logic for adding to crush
        console.log("Add to Crush clicked");
    };

    const handleAddToIgnore = () => {
        // Add logic for adding to ignore
        console.log("Add to Ignore clicked");
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };


    return (

        <Container maxWidth="sm" style={{ height: '100vh', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, }}>

            {/* profile div */}

            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'space-around', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '20px', marginBottom: '20px', marginTop: '10px' }}>
                <div className='p-3 m-0 rounded-2'>
                    <Grid container alignItems="center" spacing={3}>
                        <Grid item>
                            <Avatar
                                src={userPhotoUrl || defaultImageUrl}
                                alt="Profile Avatar"
                                style={{ width: '100px', height: '100px' }}
                            />
                        </Grid>

                        <Grid item>

                            {/* name */}
                            {userData && (
                                <Typography style={{ color: colors.textColor, fontSize: "18px" }}>
                                    {`${capitalizeFirstLetter(userData.firstName)} ${capitalizeFirstLetter(userData.lastName)}`}
                                </Typography>
                            )}

                            {/* username */}
                            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                <AlternateEmailIcon style={{ color: colors.iconColor, fontSize: "16px" }} />
                                <Typography style={{ fontSize: "14px", color: colors.labelColor }}>
                                    {loginUserUsername}
                                </Typography>
                            </div>

                            {/* location */}
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
                                <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>50</Typography>
                                <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                                    Post
                                </Typography>
                            </div>
                        </Grid>

                    </Grid>
                </div>
            </div>

            {/* cout div */}

            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '20px', marginBottom: '20px' }}>
                <Grid item className='d-flex gap-4 p-3'>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ fontSize: '30px', color: colors.textColor }}>50</Typography>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor }}>
                            Ratting
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>50</Typography>
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
            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '20px', marginBottom: '20px' }}>
                <Grid container justifyContent="space-around">
                    <Tooltip title="Add to Friend" arrow>
                        <IconButton color="primary" onClick={handleAddToFriend}>
                            <PersonAddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Message" arrow>
                        <IconButton color="secondary" onClick={handleMessage}>
                            <MessageIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Crush" arrow>
                        <IconButton color="error" onClick={handleAddToCrush}>
                            <GiHeartKey />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Ignore" arrow>
                        <IconButton color="warning" onClick={handleAddToIgnore}>
                            <GiBrokenSkull />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </div>



            {/* post div */}
            <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '20px', marginBottom: '20px' }}>
                <Grid>
                    <PostProfile />
                </Grid>
            </div>


        </Container>
    );
}

export default ProfileSet;