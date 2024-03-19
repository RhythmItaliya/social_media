import React, { useEffect, useState } from 'react';
import { useDarkMode } from "../../theme/Darkmode";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PostProfile from './PostProfile';
import { useSelector } from 'react-redux';
import CustomButton from './CustomButton';
import { CloseOutlined } from '@material-ui/icons';

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
import LoadingBar from 'react-top-loading-bar';
import config from '../../configuration';

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

    const defaultImageUrl = 'https://robohash.org/yourtext.png';
    const uuid = useSelector(state => state.useruuid.uuid);
    const profileUUID = useSelector(state => state.profileuuid.uuid);
    const userPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);
    const loginUserUsername = useSelector((state) => state.name.username);

    const [isAvtar, setAvtar] = useState(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
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
                setUserData({
                    firstName: data.userProfile.firstName,
                    lastName: data.userProfile.lastName,
                    location: data.userProfile.location,
                });
                setUserBio(data.userProfile.bio || '');
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uuid]);

    useEffect(() => {
        const fetchUserPostCount = async () => {
            try {
                const postCountResponse = await fetch(`${config.apiUrl}/api/userPostsCount/${profileUUID}`, {
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

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <Container maxWidth="sm" style={{ border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
            {/* profile div */}
            <div className='gap-3' style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'space-around', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, borderRadius: '10px', marginBottom: '10px', marginTop: '10px' }}>
                {loading ? (
                    <LoadingBar color="#ec1b90" height={3} />
                ) : (
                    <div className='p-3 m-0 rounded-2'>
                        <Grid container alignItems="center" spacing={3}>
                            <Grid item>
                                <Avatar
                                    src={userPhotoUrl || defaultImageUrl}
                                    alt="Profile Avatar"
                                    style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                    onClick={() => {
                                        setIsAvatarModalOpen(true);
                                        setAvtar(true);
                                    }}
                                />
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
                                        <Avatar
                                            src={userPhotoUrl || defaultImageUrl}
                                            alt="Profile Avatar"
                                            style={{
                                                width: '130px',
                                                height: '130px',
                                                margin: 'auto',
                                            }}
                                        />
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
                                    <Typography style={{ color: colors.textColor, fontSize: "18px" }}>
                                        {`${capitalizeFirstLetter(userData.firstName)} ${capitalizeFirstLetter(userData.lastName)}`}
                                    </Typography>
                                )}

                                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                    <Typography style={{ fontSize: "16px", color: colors.labelColor }}>
                                        {`@${loginUserUsername || ''}`}
                                    </Typography>
                                </div>

                                {userData && (
                                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                        <LocationOnIcon style={{ color: colors.iconColor, fontSize: "14px" }} />
                                        <Typography style={{ fontSize: "12px", color: colors.labelColor }}>
                                            {`${userData.location || ''}`}
                                        </Typography>
                                    </div>
                                )}
                            </Grid>

                            <Grid item>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>{postCount.toString().padStart(2, '0')}</Typography>
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
    );
};

export default ProfileSet;