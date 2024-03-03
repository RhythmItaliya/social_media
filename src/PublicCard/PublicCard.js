import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Container } from '@mui/material';
import PublicPost from './PublicPost';
import PublicFriendHandling from './PublicFriendHandling';


const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const PublicCard = ({ uuid, profileUUID, username, photoURL, colors, loading }) => {

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


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className='vh-100 overflow-hidden'>
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
                                    <Typography style={{ fontSize: "16px", color: colors.labelColor }}>
                                        {`@${username || ''}`}
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
                            <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>{friendCount.toString().padStart(2, '0')}</Typography>
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
                <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', marginBottom: '10px' }}>
                    <PublicFriendHandling colors={colors} uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} loading={loading} />
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
            </Container >
        </div >
    );
}


export default PublicCard;