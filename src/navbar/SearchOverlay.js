import React, { useState } from 'react';
import { CircularProgress, Avatar, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CheckCircleOutlineOutlined, PersonAdd } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import config from '../configuration';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const SearchOverlay = ({ searchTerm, searchResults, loading, error, colors, onClose }) => {
    const showBorder = searchResults.length > 0;

    const [friendRequestSent, setFriendRequestSent] = useState(false);

    const handleUserClick = (user) => {
        console.log('User Profile UUID:', user.userProfile.uuid);
    };

    const profileUUID = useSelector((state) => state.profileuuid.uuid);

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await fetch(`${config.apiUrl}/friendRequests`, {
                method: 'POST',
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
                setFriendRequestSent(true);
            } else {
                console.error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    if (searchResults.length === 0 && !loading && !error) {
        return null;
    }

    return (
        <div
            className='searchOverlay d-flex justify-content-center align-content-center'
            style={{
                borderLeft: showBorder ? `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` : 'none',
                borderRight: showBorder ? `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` : 'none',
                width: '100%',
                height: '100%',
                position: 'fixed',
                zIndex: 9999,
                // backgroundColor: colors.transparentColor,
                // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backgroundColor: colors.backgroundColor,
                top: '57%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                overflowY: 'auto',
                display: showBorder ? 'flex' : 'none',
            }}
        >
            <IconButton
                aria-label="close"
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: colors.textColor,
                }}
            >
                <CloseIcon />
            </IconButton>

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CircularProgress style={{ color: 'red' }} />
                </div>
            )}

            {error && (
                <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    Error: {error}
                </div>
            )}

            {!loading && !error && (
                <div className='d-flex w-100 m-4 flex-column' style={{
                }}>
                    {searchResults.map((user) => (
                        <div
                            key={user.uuid}
                            className='mb-2 p-1'
                            style={{
                                borderBottom: `1px solid rgba(${hexToRgb(colors.border)},0.7)`,
                            }}
                            onClick={() => handleUserClick(user)}
                        >

                            <div className='d-flex p-2 justify-content-around'>
                                <div className="d-flex justify-content-around">
                                    <div className="d-flex justify-content-center align-content-center">
                                        {(user.userProfile && user.userProfile.profilePhote) ? (
                                            <Avatar
                                                src={`http://static.profile.local/${user.userProfile.profilePhote.photoURL}`}
                                                alt={`Profile of ${user.username}`}
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        ) : (
                                            <Avatar
                                                alt={`Profile of ${user.username}`}
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-column justify-content-start align-items-center ms-3" style={{
                                        cursor: 'pointer',
                                    }}>
                                        <Typography variant="body1" style={{ color: colors.textColor, fontWeight: '500' }}>
                                            {user.userProfile && user.userProfile.firstName && (
                                                user.userProfile.firstName.charAt(0).toUpperCase() + user.userProfile.firstName.slice(1)
                                            )}{' '}
                                            {user.userProfile && user.userProfile.lastName && (
                                                user.userProfile.lastName.charAt(0).toUpperCase() + user.userProfile.lastName.slice(1)
                                            )}
                                        </Typography>
                                        <Typography variant="body2" style={{ color: colors.labelColor }}>
                                            {user.username && `@${user.username}`}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center align-items-center" style={{
                                    gap: '20px'
                                }}>
                                    <IconButton
                                        style={{ color: colors.backgroundColor, backgroundColor: colors.backgroundColor }}
                                        onClick={() => sendFriendRequest(user.userProfile.uuid)}
                                        disabled={friendRequestSent}
                                    >
                                        {friendRequestSent ? (
                                            <CheckCircleOutlineOutlined fontSize="small" style={{ color: 'green' }} />
                                        ) : (
                                            <PersonAdd fontSize="small" style={{ color: colors.textColor }} />
                                        )}
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && searchResults.length === 0 && searchTerm && (
                <p style={{ color: colors.textColor, backgroundColor: 'red', textAlign: 'center', padding: '20px' }}>No matching users found</p>
            )}
        </div>
    );
};

export default SearchOverlay;