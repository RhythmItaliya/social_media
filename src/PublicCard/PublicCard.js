import React, { useEffect, useState } from 'react';
import PublicPost from './PublicPost';
import PublicFriendHandling from './PublicFriendHandling';
import PublicCustomButton from './PublicCustomButton';
import config from '../configuration';
import PublicPageNav from './PublicPageNav';


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

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const PublicCard = ({ uuid, profileUUID, username, photoURL, colors, userUUID }) => {

    const [userData, setUserData] = useState(null);
    const [postCount, setPostCount] = useState(0);
    const [userBio, setUserBio] = useState('');

    const [isAvtar, setAvtar] = useState(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    const [loading, setLoading] = useState(true);

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
        <div>
            <PublicPageNav colors={colors} photoURL={photoURL} />
            <div className='overflow-hidden' style={{ marginTop: '80px', height: '90vh', }}>
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
                                        {photoURL ? (
                                            <Avatar
                                                src={`http://static.profile.local/${photoURL}`}
                                                alt={`${username || ''}`}
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
                                            {`@${username || ''}`}
                                        </DialogTitle>

                                        <DialogContent
                                            style={{
                                                backgroundColor: colors.backgroundColor,
                                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                                                borderBottom: 'none',
                                                padding: '20px',
                                                boxShadow: colors.boxShadow,
                                            }}
                                        >
                                            {isAvtar && (
                                                photoURL ? (
                                                    <Avatar
                                                        src={`http://static.profile.local/${photoURL}`}
                                                        alt={`${username || ''}`}
                                                        style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setIsAvatarModalOpen(true);
                                                            setAvtar(true);
                                                        }}
                                                    />
                                                ) : (
                                                    <Avatar
                                                        alt={`@${username || ''}`}
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
                                                {`@${username || ''}`}
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
                        <PublicCustomButton userUUID={userUUID} colors={colors} uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} loading={loading} />
                    </div>

                    {/* Button div */}
                    <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', marginBottom: '10px' }}>
                        <PublicFriendHandling userUUID={userUUID} colors={colors} uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} loading={loading} />
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
                            <PublicPost userUUID={userUUID} profileUUID={profileUUID} />
                        </Grid>
                    </div>
                </Container >
            </div >
        </div >
    );
}


export default PublicCard;