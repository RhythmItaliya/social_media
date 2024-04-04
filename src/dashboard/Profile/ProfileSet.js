import React, { useEffect, useState } from 'react';
import { useDarkMode } from "../../theme/Darkmode";
import PostProfile from './PostProfile';
import { useSelector } from 'react-redux';
import CustomButton from './CustomButton';

import {
    IconButton,
    Grid,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';


import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import { CloseOutlined } from '@material-ui/icons';

import config from '../../configuration';
import AllNotification from '../../notification/AllNotification';
import SuggestedFriendMain from '../../mixComponet/SuggestedFriendMain';

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
    const [postCount, setPostCount] = useState(0);
    const [userBio, setUserBio] = useState('');
    const [loading, setLoading] = useState(true);

    const uuid = useSelector(state => state.useruuid.uuid);
    const profileUUID = useSelector(state => state.profileuuid.uuid);
    const userPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);
    const loginUserUsername = useSelector((state) => state.name.username);

    const [isAvtar, setAvtar] = useState(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${config.apiUrl}/users/${uuid}`, {
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
                const locationData = JSON.parse(data.userProfile.location);

                const { country, state, city } = locationData;

                setUserData({
                    firstName: data.userProfile.firstName,
                    lastName: data.userProfile.lastName,
                    location: {
                        country: country,
                        state: state,
                        city: city
                    },
                });
                setUserBio(data.userProfile.bio || '');
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uuid]);

    useEffect(() => {
        const fetchUserPostCount = async () => {
            try {
                setLoading(true);

                const postCountResponse = await fetch(`${config.apiUrl}/posts/api/userPostsCount/${profileUUID}`, {
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
            } finally {
                setLoading(false);
            }
        };

        fetchUserPostCount();
    }, [profileUUID]);


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className='container-fluid'>
            <div className='row justify-content-center'>
                <div className='col-lg-3 notificationMain'>
                    <AllNotification colors={colors} />
                </div>
                <div className='col-lg-5 d-flex align-items-center justify-content-center'>
                    <Container maxWidth="sm" style={{ border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                        {/* profile div */}
                        <div className='gap-3' style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'space-around', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }}>
                            {loading ? (
                                <div className="loading-dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            ) : (
                                <div className='p-3 m-0 rounded-2'>
                                    <Grid container alignItems="center" spacing={3}>

                                        <Grid item>
                                            {userPhotoUrl ? (
                                                <Avatar
                                                    src={userPhotoUrl}
                                                    alt={`${loginUserUsername || ''}`}
                                                    style={{ width: '100px', height: '100px', cursor: 'pointer', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}
                                                    onClick={() => {
                                                        setIsAvatarModalOpen(true);
                                                        setAvtar(true);
                                                    }}
                                                />
                                            ) : (
                                                <Avatar
                                                    alt={`@${loginUserUsername || ''}`}
                                                    style={{ width: '100px', height: '100px', cursor: 'pointer', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}
                                                    onClick={() => {
                                                        setIsAvatarModalOpen(true);
                                                        setAvtar(true);
                                                    }} />
                                            )}
                                        </Grid>

                                        {/* Avatar Modal */}
                                        <Dialog open={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)}>

                                            <DialogTitle style={{
                                                color: colors.textColor,
                                                backgroundColor: colors.backgroundColor,
                                                textAlign: 'center',
                                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                                                borderBottom: 'none',
                                                boxShadow: colors.boxShadow,
                                                fontSize: '16px'
                                            }}>
                                                {`@${loginUserUsername || ''}`}
                                            </DialogTitle>

                                            <DialogContent
                                                style={{
                                                    backgroundColor: colors.backgroundColor,
                                                    border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                                                    borderBottom: 'none',
                                                    padding: '20px',
                                                    boxShadow: colors.boxShadow,
                                                }}>
                                                {isAvtar && (
                                                    userPhotoUrl ? (
                                                        <Avatar
                                                            src={userPhotoUrl}
                                                            alt={`${loginUserUsername || ''}`}
                                                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                                            onClick={() => {
                                                                setIsAvatarModalOpen(true);
                                                                setAvtar(true);
                                                            }}
                                                        />
                                                    ) : (
                                                        <Avatar
                                                            style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                                            onClick={() => {
                                                                setIsAvatarModalOpen(true);
                                                                setAvtar(true);
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </DialogContent>

                                            <DialogActions
                                                style={{
                                                    backgroundColor: colors.backgroundColor,
                                                    border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                                                    boxShadow: colors.boxShadow,
                                                }}>
                                                <IconButton
                                                    style={{
                                                        color: colors.iconColor
                                                    }} onClick={() => setIsAvatarModalOpen(false)}>
                                                    <CloseOutlined />
                                                </IconButton>
                                            </DialogActions>
                                        </Dialog>


                                        <Grid item>
                                            {userData && (
                                                <Typography style={{ color: colors.textColor, fontSize: "16px" }}>
                                                    {`${capitalizeFirstLetter(userData.firstName)} ${capitalizeFirstLetter(userData.lastName)}`}
                                                </Typography>
                                            )}

                                            <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginTop: '0px', marginBottom: '0px' }}>
                                                <AlternateEmailOutlinedIcon style={{ color: colors.iconColor, fontSize: "12px", opacity: '0.7' }} />
                                                <Typography style={{ fontSize: "14px", color: colors.labelColor }}>
                                                    {`${loginUserUsername || ''}`}
                                                </Typography>
                                            </div>

                                            {userData && (
                                                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                                    <PlaceOutlinedIcon style={{ color: colors.iconColor, fontSize: "10px", opacity: '0.7' }} />
                                                    <Typography style={{ fontSize: "12px", color: colors.labelColor }}>
                                                        {`${userData.location.country}, ${userData.location.state}, ${userData.location.city}` || ' '}
                                                    </Typography>
                                                </div>
                                            )}
                                        </Grid>

                                        <Grid item>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>
                                                    {postCount === 0 ? '0' : postCount.toString().padStart(2, '0')}
                                                </Typography>
                                                <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                                                    Post
                                                </Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            )}
                        </div>

                        {/* count div */}
                        <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px', marginBottom: '10px' }}>
                            <CustomButton />
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
                                <PostProfile />
                            </Grid>
                        </div>
                    </Container>
                </div>
                <div className='col-lg-3 suggestedFriendMain'>
                    <SuggestedFriendMain colors={colors} />
                </div>
            </div>
        </div>
    );
};

export default ProfileSet;