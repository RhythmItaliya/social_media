// SenderComponent.js

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import StyledIconButton from '@material-ui/core/IconButton';
import { PersonAdd } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../theme/Darkmode';
import { css } from '@emotion/react';
import { ScaleLoader } from 'react-spinners';

import './abc.css';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: '#000000', // Dark color for the spinner in light mode
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff', // Light color for the spinner in dark mode
};

const SenderComponent = () => {
    const uuid = useSelector((state) => state.profileuuid.uuid);
    const [userProfiles, setUserProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [renderIndex, setRenderIndex] = useState(0);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        // Simulate a minimum loading time of 1000 milliseconds (adjust as needed)
        const timer = setTimeout(() => {
            // Fetch user profiles
            fetch(`http://localhost:8080/api/userProfiles/${uuid}`, {
                method: 'GET',
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.userProfiles && data.userProfiles.length > 0) {
                        setUserProfiles(data.userProfiles);
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false); // Set loading to false after data is fetched or in case of error
                });
        }, 1000);

        return () => clearTimeout(timer);
    }, [uuid]);

    useEffect(() => {
        // This effect controls the rendering of items one after another
        const timer = setTimeout(() => {
            setRenderIndex((prevIndex) => prevIndex + 1);
        }, 700); // Adjust the delay between items as needed

        return () => clearTimeout(timer);
    }, [renderIndex]);

    const sendFriendRequest = async (receiverId) => {
        try {
            // Make a POST request to your backend endpoint to send the friend request
            const response = await fetch('http://localhost:8080/friendRequests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: uuid,
                    receiverId: receiverId,
                }),
            });

            if (response.ok) {
                // Friend request sent successfully, you can handle the UI accordingly
                console.log('Friend request sent successfully');
            } else {
                // Handle error scenarios
                console.error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <div className='p-3'>

            <p style={{ color: colors.textColor }} >Suggested Friend</p>
            {loading ? (
                <div className="loading-spinner">
                    <ScaleLoader color={colors.spinnerColor} loading={loading} height={15} />
                </div>
            ) : (
                userProfiles.slice(0, renderIndex).map((profile) => (
                    <Paper
                        key={profile.uuid}
                        elevation={3}
                        className='d-flex mt-4 flex-column align-items-center p-2'
                        style={{
                            backgroundColor: isDarkMode
                                ? darkModeColors.backgroundColor
                                : lightModeColors.backgroundColor,
                            color: isDarkMode
                                ? darkModeColors.textColor
                                : lightModeColors.textColor,
                            borderBottom: `1px solid ${isDarkMode ? darkModeColors.border : lightModeColors.border}`,

                        }}
                    >
                        <Avatar
                            className="avatar-wrapper mt-2"
                            alt="User Avatar"
                            src={`http://static.profile.local/${profile.photoURL}`}
                        />

                        <p
                            className='m-2'
                            style={{
                                fontSize:'14px',
                                color: isDarkMode
                                    ? darkModeColors.textColor
                                    : lightModeColors.textColor,
                            }}
                        >
                            {profile.username}
                        </p>

                        <StyledIconButton
                            color="inherit"
                            className='m-0'
                            style={{
                                color: isDarkMode
                                    ? darkModeColors.iconColor
                                    : lightModeColors.iconColor,
                            }}
                            onClick={() => sendFriendRequest(profile.uuid)}
                        >
                            <PersonAdd fontSize="small" />
                        </StyledIconButton>
                    </Paper>
    ))
            )}
        </div >
    );
};

export default SenderComponent;
