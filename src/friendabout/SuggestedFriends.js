// SuggestedFriends.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import { PersonAdd, CheckCircleOutline } from "@mui/icons-material";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { IconButton } from '@mui/material';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const SuggestedFriends = ({ colors }) => {
    const profileUUID = useSelector((state) => state.profileuuid.uuid);

    const [userProfiles, setUserProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequestStatus, setFriendRequestStatus] = useState({});

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/userProfiles/${profileUUID}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.userProfiles && data.userProfiles.length > 0) {
                        setUserProfiles(data.userProfiles.map(profile => ({
                            uuid: profile.uuid,
                            username: profile.username,
                            photoURL: profile.photoURL,
                            firstName: profile.firstName,
                            lastName: profile.lastName,
                        })));
                    }
                } else {
                    console.error('Failed to fetch user profiles');
                }
            } catch (error) {
                console.error('Error fetching user profiles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfiles();
    }, [profileUUID]);

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await fetch('http://localhost:8080/friendRequests', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: profileUUID,
                    receiverId: receiverId,
                }),
            });

            if (response.ok) {
                console.log('Friend request sent successfully');
                setFriendRequestStatus((prevStatus) => ({
                    ...prevStatus,
                    [receiverId]: true,
                }));
            } else {
                console.error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const capitalizeFirstLetter = (str) => {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                overflowY: 'scroll',
                padding: '0'
            }
            }>
            <p className='mt-3 mb-4' style={{ color: colors.textColor, textAlign: 'center' }}>Suggested Friends</p>
            {loading && (
                <div className="loading-spinner">
                    <ScaleLoader color={colors.spinnerColor} loading={loading} height={15} />
                </div>
            )}
            {!loading && userProfiles.length === 0 && (
                <p className='p-2' style={{ color: colors.textColor }}>
                    {userProfiles.length === 0 ? 'No suggested friends found.' : 'Result not found.'}
                </p>
            )}
            {!loading && userProfiles.length > 0 && (
                userProfiles.map((data, index) => (
                    <div
                        key={index}
                        className='d-flex m-2 p-2 gap-3 justify-content-around align-items-center'
                        style={{
                            borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                        }}>
                        <Grid item xs={4}>
                            <div className='avatar-container' style={{ cursor: 'pointer' }}>
                                <Avatar
                                    className="avatar-wrapper"
                                    alt="User Avatar"
                                    src={`http://static.profile.local/${data.photoURL}`}
                                    style={{
                                        width: '35px',
                                        height: '35px'
                                    }}
                                />
                            </div>
                        </Grid>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <p style={{ color: colors.textColor, margin: '0' }}>
                                <span style={{ margin: '0', color: colors.textColor, fontSize: '14px' }}>
                                    {capitalizeFirstLetter(data.firstName)} {capitalizeFirstLetter(data.lastName)}
                                </span>
                                <br />
                                <span style={{ margin: '0', color: colors.labelColor, fontSize: '12px' }}>
                                    {`@${data.username}`}
                                </span>
                            </p>
                        </div>

                        <div className='details'>
                            <IconButton
                                className='send-request-button'
                                onClick={() => sendFriendRequest(data.uuid)}
                                disabled={friendRequestStatus[data.uuid]}
                                style={{ backgroundColor: colors.backgroundColor }}
                            >
                                {friendRequestStatus[data.uuid] ? (
                                    <CheckCircleOutline fontSize="small" style={{ color: 'green' }} />
                                ) : (
                                    <PersonAdd style={{ color: colors.iconColor }} fontSize="small" />
                                )}
                            </IconButton>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SuggestedFriends;

