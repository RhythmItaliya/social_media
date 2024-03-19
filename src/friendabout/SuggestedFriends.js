// SuggestedFriends.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import { PersonAdd, CheckCircleOutline, RefreshSharp } from "@mui/icons-material";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { IconButton } from '@mui/material';
import config from '../configuration';

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
        fetchUserProfiles();
    }, [profileUUID]);

    const fetchUserProfiles = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/api/userProfiles/${profileUUID}`, {
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

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await fetch(`${config.apiUrl}/friendRequests`, {
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
            className='mt-5 p-1 overflow-y-scroll w-100'
            style={{
                height: '700px',
                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            }}>

            <div className='py-3 d-flex justify-content-between align-items-center' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, }}>
                <div className='d-flex align-items-center justify-content-center'>
                    <p className='m-2' style={{ color: colors.textColor }}>Suggested Friends</p>
                </div>
                <div>
                    <IconButton style={{ color: colors.iconColor }} onClick={fetchUserProfiles}>
                        <RefreshSharp />
                    </IconButton>
                </div>
            </div>


            {loading && (
                <div className="loading-spinner">
                    <p style={{ color: colors.textColor }}>Loading...</p>
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
                        className='d-flex mx-auto m-2 p-2 justify-content-around align-items-center'
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

