import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import StyledIconButton from '@material-ui/core/IconButton';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../theme/Darkmode';
import { ScaleLoader } from 'react-spinners';
import { PersonAdd, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import './abc.css';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    spinnerColor: 'rgb(0,0,0)',
    labelColor: '#8e8e8e',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    border: '#333333',
    spinnerColor: '#ffffff',
    labelColor: '#CCC',
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const SenderComponent = () => {
    const uuid = useSelector((state) => state.profileuuid.uuid);
    const [userProfiles, setUserProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [friendRequestStatus, setFriendRequestStatus] = useState({});
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/userProfiles/${uuid}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.userProfiles && data.userProfiles.length > 0) {
                        setUserProfiles(data.userProfiles);
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

        const timer = setTimeout(() => {
            fetchUserProfiles();
        }, 1000);

        return () => clearTimeout(timer);
    }, [uuid]);

    const sendFriendRequest = async (receiverId) => {
        try {
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
                setFriendRequestStatus((prevStatus) => ({
                    ...prevStatus,
                    [receiverId]: true,
                }));
                console.log('Friend request sent successfully');
            } else {
                console.error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const [selectedProfile, setSelectedProfile] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

    const handleAvatarClick = (profile, event) => {
        if (selectedProfile && selectedProfile.uuid === profile.uuid) {
            setSelectedProfile(null);
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            setCardPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            });
            setSelectedProfile(profile);
        }
    };

    const handleClickOutsideCard = (event) => {
        if (selectedProfile && !event.currentTarget.contains(event.target)) {
            setSelectedProfile(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutsideCard);
        return () => {
            document.removeEventListener('click', handleClickOutsideCard);
        };
    }, [selectedProfile]);

    return (
        <div className='rounded-2 mt-4' style={{ border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
            <p style={{
                color: colors.textColor,
                fontSize: '18px',
                padding: '15px',
                borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            }}>
                Suggested Friends
            </p>
            <Grid
                container spacing={2}
                className="avatar-grid"
                style={{
                    padding: '10px',
                    marginLeft: 0,
                }}
            >
                {loading ? (
                    <div className="loading-spinner justify-content-center d-flex align-content-center">
                        <ScaleLoader color={colors.spinnerColor} loading={loading} height={15} />
                    </div>
                ) : (
                    userProfiles.map((profile) => (
                        <Grid item xs={4} key={profile.uuid}>
                            <div
                                className='avatar-container'
                                onClick={(e) => handleAvatarClick(profile, e)}
                            >
                                <Avatar
                                    className="avatar-wrapper"
                                    alt="User Avatar"
                                    src={`http://static.profile.local/${profile.photoURL}`}
                                />
                            </div>
                        </Grid>
                    ))
                )}
            </Grid>
            {selectedProfile && (
                <div
                    className='selected-profile-details-overlay'
                />
            )}
            {selectedProfile && (
                <div
                    className='selected-profile-details-container rounded-2 p-3'
                    style={{
                        position: 'absolute',
                        top: cardPosition.top,
                        left: cardPosition.left,
                        backgroundColor: colors.backgroundColor,
                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`
                    }}
                >
                    <Avatar
                        className="selected-avatar"
                        alt="Selected User Avatar"
                        src={`http://static.profile.local/${selectedProfile.photoURL}`}
                        onClick={(e) => handleAvatarClick(selectedProfile, e)}

                    />
                    <div className='details'>
                        <p style={{ color: colors.labelColor, marginTop: '12px' }}>{selectedProfile.username}</p>
                        <StyledIconButton
                            className='send-request-button'
                            onClick={() => sendFriendRequest(selectedProfile.uuid)}
                            disabled={friendRequestStatus[selectedProfile.uuid]}
                            style={{ color: colors.iconColor, backgroundColor: "#F0F0F0" }}
                        >
                            {friendRequestStatus[selectedProfile.uuid] ? (
                                <CheckCircleOutlineIcon fontSize="small" style={{ color: 'green' }} />
                            ) : (
                                <PersonAdd fontSize="small" />
                            )}
                        </StyledIconButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SenderComponent;
