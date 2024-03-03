import React, { useEffect, useState } from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const PublicFriendHandling = ({ colors, uuid, profileUUID }) => {
    const [loading, setLoading] = useState(true);
    const [friendRequestStatus, setFriendRequestStatus] = useState(null);
    const [isCrushAdded, setCrushAdded] = useState(false);
    const [isIgnored, setIgnored] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);

            const friendRequestPromise = fetch(`http://localhost:8080/get/public/friendRequests/?senderId=${uuid}&receiverId=${profileUUID}`)
                .then((friendRequestResponse) => {
                    if (!friendRequestResponse.ok) {
                        throw new Error(`Friend request status request failed: ${friendRequestResponse.status}`);
                    }
                    return friendRequestResponse.json();
                })
                .then((friendRequestData) => {
                    if (friendRequestData.success) {
                        setFriendRequestStatus((prevStatus) => friendRequestData.status);
                    }
                });

            const crushPromise = fetch(`http://localhost:8080/get/public/crushesRequest/?senderId=${uuid}&receiverId=${profileUUID}`)
                .then((crushResponse) => {
                    if (!crushResponse.ok) {
                        throw new Error(`Crush status request failed: ${crushResponse.status}`);
                    }
                    return crushResponse.json();
                })
                .then((crushData) => {
                    if (crushData.success) {
                        setCrushAdded((prevStatus) => crushData.status);
                    }
                });

            Promise.all([friendRequestPromise, crushPromise])
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error('Error fetching data:', error.message);
                    setError('Error fetching data. Please try again.');
                    setLoading(false);
                });
        };

        if (uuid && profileUUID) {
            fetchData();
        }
    }, [uuid, profileUUID]);

    const handleAddToFriend = () => {
        setLoading(true);

        fetch('http://localhost:8080/public/friendRequests', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: uuid,
                receiverId: profileUUID,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to handle friend request');
                }
            })
            .then((responseData) => {
                if (responseData.success) {
                    setFriendRequestStatus((prevStatus) => responseData.status);

                    // After the successful POST, make a GET request to update the state based on the response
                    fetch(`http://localhost:8080/get/public/friendRequests/?senderId=${uuid}&receiverId=${profileUUID}`)
                        .then((friendRequestResponse) => {
                            if (!friendRequestResponse.ok) {
                                throw new Error(`Friend request status request failed: ${friendRequestResponse.status}`);
                            }
                            return friendRequestResponse.json();
                        })
                        .then((friendRequestData) => {
                            if (friendRequestData.success) {
                                setFriendRequestStatus((prevStatus) => friendRequestData.status);
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching data after POST:', error.message);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    console.error('Failed to handle friend request');
                    setError('Failed to handle friend request. Please try again.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error handling friend request:', error);
                setError('Error handling friend request. Please try again.');
                setLoading(false);
            });
    };

    const handleSetCrush = () => {
        setLoading(true);

        fetch('http://localhost:8080/public/crushesRequest', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: uuid,
                receiverId: profileUUID,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to handle crush request');
                }
            })
            .then((responseData) => {
                if (responseData.success) {
                    setCrushAdded((prevStatus) => responseData.status === '2');

                    fetch(`http://localhost:8080/get/public/crushesRequest/?senderId=${uuid}&receiverId=${profileUUID}`)
                        .then((crushResponse) => {
                            if (!crushResponse.ok) {
                                throw new Error(`Crush status request failed: ${crushResponse.status}`);
                            }
                            return crushResponse.json();
                        })
                        .then((crushData) => {
                            if (crushData.success) {
                                setCrushAdded((prevStatus) => crushData.status);
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching data after POST:', error.message);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    console.error('Failed to handle crush request');
                    setError('Failed to handle crush request. Please try again.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error handling crush request:', error);
                setError('Error handling crush request. Please try again.');
                setLoading(false);
            });
    };

    const handleMessage = () => {
        console.log("Message clicked");
    };

    const handleAddToIgnore = () => {
        setIgnored((prevState) => !prevState);
    };

    const buttonStyle = {
        fontSize: '16px',
        color: colors.textColor,
        backgroundColor: friendRequestStatus === "1" ? colors.backgroundColor : colors.backgroundColor,
        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
    };

    return (
        <>
            {loading && <p style={{ color: colors.textColor }}>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <Grid container justifyContent="space-around">
                    <Tooltip title="Add to Friend" arrow>
                        <IconButton
                            className='rounded-1'
                            style={buttonStyle}
                            onClick={handleAddToFriend}
                        >
                            {friendRequestStatus === "1" ? 'Friend Request Sent' : (friendRequestStatus === "2" ? 'You are now Friends' : 'Friend')}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Message" arrow>
                        <IconButton
                            className='rounded-1'
                            style={{ fontSize: '16px', color: colors.textColor, backgroundColor: colors.backgroundColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}
                            onClick={handleMessage}>
                            Message
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={isCrushAdded === "1" ? 'Crush' : (isCrushAdded === "2" ? 'You have a new Crush' : 'Crush')} arrow>
                        <IconButton
                            className='rounded-1'
                            style={buttonStyle}
                            onClick={handleSetCrush}
                        >
                            {isCrushAdded === "1" ? 'Crush' : (isCrushAdded === "2" ? 'You have a new Crush' : 'Crush')}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add to Ignore" arrow>
                        <IconButton
                            className='rounded-1'
                            style={buttonStyle}
                            onClick={handleAddToIgnore}
                        >
                            {isIgnored ? 'Ignored' : 'Ignore'}
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
        </>
    );
};

export default PublicFriendHandling;