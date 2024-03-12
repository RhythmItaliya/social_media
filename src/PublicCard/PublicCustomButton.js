// PublicCustomButton.js
import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Tooltip,
    Drawer,
    Grid,
    Container,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import '../dashboard/Profile/ProfileSet.css';
import { CloseOutlined } from '@material-ui/icons';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const PublicCustomButton = ({ colors, profileUUID }) => {
    const [friendDrawerOpen, setFriendDrawerOpen] = useState(false);
    const [messageDrawerOpen, setMessageDrawerOpen] = useState(false);
    const [crushDrawerOpen, setCrushDrawerOpen] = useState(false);
    const [ignoreDrawerOpen, setIgnoreDrawerOpen] = useState(false);

    const [friendCount, setFriendPostCount] = useState(0);
    const [fetchedFriendsList, setFetchedFriendsList] = useState([]);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const [crushCount, setCrushCount] = useState(0);
    const [fetchedCrushList, setFetchedCrushList] = useState([]);
    const [ignoreCount, setIgnoreCount] = useState(0);
    const [fetchedIgnoreList, setFetchedIgnoreList] = useState([]);

    const handleDrawerOpen = (drawerType) => {
        // Close all drawers first
        setFriendDrawerOpen(false);
        setMessageDrawerOpen(false);
        setCrushDrawerOpen(false);
        setIgnoreDrawerOpen(false);

        // Open the requested drawer
        switch (drawerType) {
            case 'friendCount':
                setFriendDrawerOpen(true);
                break;
            case 'ratting':
                setMessageDrawerOpen(true);
                break;
            case 'crush':
                setCrushDrawerOpen(true);
                break;
            case 'ignore':
                setIgnoreDrawerOpen(true);
                break;
            default:
                break;
        }
    };

    const handleDrawerClose = (drawerType) => {
        switch (drawerType) {
            case 'friendCount':
                setFriendDrawerOpen(false);
                break;
            case 'ratting':
                setMessageDrawerOpen(false);
                break;
            case 'crush':
                setCrushDrawerOpen(false);
                break;
            case 'ignore':
                setIgnoreDrawerOpen(false);
                break;
            default:
                break;
        }
    };

    const renderCloseIcon = (drawerType) => (
        <Tooltip sx={{ color: colors.textColor }} title={`Close ${drawerType} Drawer`} arrow>
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    color: colors.iconColor,

                }}
                onClick={() => handleDrawerClose(drawerType)}
            >
                <CloseOutlined />
            </IconButton>
        </Tooltip>
    );


    // API 

    // About Friend
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch friend count
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

                const friendCountData = await friendCountResponse.json();
                setFriendPostCount(friendCountData.friendshipCount);

                // Fetch friends list
                const friendsListResponse = await fetch(`http://localhost:8080/api/friendships/users/${profileUUID}`);
                const friendsListData = await friendsListResponse.json();

                if (friendsListResponse.ok) {
                    const fetchedFriendsList = friendsListData.friends;
                    setFetchedFriendsList(fetchedFriendsList);
                } else {
                    console.error('Error:', friendsListData.error);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [profileUUID]);

    return (
        <>
            <div className='col-12'>
                <Grid item className='d-flex gap-4 p-3 justify-content-around'>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('ratting')}>
                            <Typography style={{ fontSize: '30px', color: colors.textColor }}>50</Typography>
                        </IconButton>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor }}>
                            Ratting
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('friendCount')}>
                            <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>
                                {friendCount.toString().padStart(2, '0')}
                            </Typography>
                        </IconButton>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                            Friend
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('crush')}>
                            <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>50</Typography>
                        </IconButton>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                            Crush Keys
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('ignore')}>
                            <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>50</Typography>
                        </IconButton>
                        <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
                            Ignore
                        </Typography>
                    </div>
                </Grid>
            </div>


            <Drawer anchor="right" open={friendDrawerOpen} onClose={() => handleDrawerClose('friendCount')}>
                <Container maxWidth="sm " className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, borderLeft: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`, boxShadow: colors.boxShadow }}>
                    {renderCloseIcon('friendCount')}
                    <div id="friendDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
                        <h3
                            className='d-flex justify-content-center align-content-center p-2 mt-2'
                            style={{
                                borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`
                            }}>
                            Your Friends
                        </h3>

                        {fetchedFriendsList.length === 0 ? (
                            <p className='mt-3' style={{ color: colors.labelColor }}>No friends available.</p>
                        ) : (
                            <div className='d-flex mt-3 flex-column'>
                                {fetchedFriendsList.map((friend) => (
                                    <div
                                        key={friend.uuid}
                                        className='d-flex gap-3 m-1 p-2 rounded-2'
                                        style={{
                                            cursor: 'pointer',
                                            borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.4)`
                                        }}>
                                        <div className="d-flex justify-content-center align-content-center" style={{ flex: '20%' }}>
                                            <Avatar
                                                src={friend.photoURL}
                                                alt={`${friend.firstName}'s Avatar`}
                                                style={{
                                                    width: '42px',
                                                    height: '42px'
                                                }}
                                                onClick={() => {
                                                    setSelectedFriend(friend);
                                                    setIsAvatarModalOpen(true);
                                                }}
                                            />
                                        </div>
                                        <div style={{ flex: '80%' }}>
                                            <div className="flex-column  justify-content-start align-items-center">
                                                <div className="pointer-event" style={{ fontSize: "14px", color: colors.textColor, fontWeight: '500' }}>
                                                    {friend.firstName.charAt(0).toUpperCase() + friend.firstName.slice(1)}{' '}
                                                    {friend.lastName.charAt(0).toUpperCase() + friend.lastName.slice(1)}
                                                </div>
                                                <div className='pointer-event' style={{ fontSize: '12px', color: colors.labelColor }}>
                                                    {`@${friend.user.username}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Container>
            </Drawer >

            <Drawer anchor="right" open={messageDrawerOpen} onClose={() => handleDrawerClose('ratting')}>
                <Container maxWidth="sm" className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                    {renderCloseIcon('ratting')}
                    <div id="messageDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
                        <h1>Message</h1>
                        {/* ... (content for Message drawer) */}
                    </div>
                </Container>
            </Drawer>

            <Drawer anchor="right" open={crushDrawerOpen} onClose={() => handleDrawerClose('crush')}>
                <Container maxWidth="sm" className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                    {renderCloseIcon('crush')}
                    <div id="crushDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
                        <h1>Crush</h1>
                        {/* ... (content for Crush drawer) */}
                    </div>
                </Container>
            </Drawer>

            <Drawer anchor="right" open={ignoreDrawerOpen} onClose={() => handleDrawerClose('ignore')}>
                <Container maxWidth="sm" className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                    {renderCloseIcon('ignore')}
                    <div id="ignoreDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
                        <h1>Ignore</h1>
                        {/* ... (content for Ignore drawer) */}
                    </div>
                </Container>
            </Drawer>




            {/* Avatar Modal */}
            <Dialog open={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)}>

                <DialogTitle style={{
                    color: colors.textColor,
                    backgroundColor: colors.backgroundColor,
                    textAlign: 'center',
                    border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                    borderBottom: 'none',
                    boxShadow: colors.boxShadow,
                }}>
                    {`@${selectedFriend?.user?.username || ''}`}
                </DialogTitle>

                <DialogContent
                    style={{
                        backgroundColor: colors.backgroundColor,
                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                        borderBottom: 'none',
                        padding: '20px',
                        boxShadow: colors.boxShadow,
                    }}>
                    {selectedFriend && (
                        <Avatar
                            src={selectedFriend.photoURL}
                            alt={`${selectedFriend.firstName}'s Avatar`}
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
        </>
    );
};

export default PublicCustomButton;
