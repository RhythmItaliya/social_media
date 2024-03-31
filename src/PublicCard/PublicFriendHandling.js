import React, { useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { message } from "antd";
import config from "../configuration";
import { useDarkMode } from '../theme/Darkmode';
import { useNavigate } from "react-router-dom";
import { setProfileUuid } from "../actions/authActions";


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

const PublicFriendHandling = ({ profileUUID, userUUID, username }) => {

    const [loading, setLoading] = useState(true);
    const [friendRequestStatus, setFriendRequestStatus] = useState(null);
    const [isCrushAdded, setCrushAdded] = useState(false);
    const [isIgnored, setIgnored] = useState(false);
    const [error, setError] = useState(null);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = () => {
            setLoading(true);

            const friendRequestPromise = fetch(`${config.apiUrl}/get/public/friendRequests/${profileUUID}`)
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

            const crushPromise = fetch(`${config.apiUrl}/crushes/get/public/crushesRequest/${profileUUID}`)
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

            const ignorePromise = fetch(`${config.apiUrl}/ignores/get/public/ignoreRequest/${profileUUID}`)
                .then((ignoreResponse) => {
                    if (!ignoreResponse.ok) {
                        throw new Error(`Ignore status request failed: ${ignoreResponse.status}`);
                    }
                    return ignoreResponse.json();
                })
                .then((ignoreData) => {
                    if (ignoreData.success) {
                        setIgnored((prevStatus) => ignoreData.status);
                    }
                });

            Promise.all([friendRequestPromise, crushPromise, ignorePromise])
                .then(() => setLoading(false))
                .catch((error) => {
                    console.error('Error fetching data:', error.message);
                    // setError('Error fetching data. Please try again.');
                    setLoading(false);
                });
        };

        if (userUUID && profileUUID) {
            fetchData();
        }
    }, [userUUID, profileUUID]);

    // FRIEND-API
    const handleAddToFriend = () => {
        setLoading(true);

        fetch(`${config.apiUrl}/public/friendRequests`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: userUUID,
                receiverId: profileUUID,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 422) {
                    message.error('Cannot send a Friend request to own profile');
                } else {
                    throw new Error('Failed to handle crush request');
                }
            })
            .then((responseData) => {
                if (responseData.success) {
                    setFriendRequestStatus((prevStatus) => responseData.status);

                    fetch(`${config.apiUrl}/get/public/friendRequests/${profileUUID}`)
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
                    // setError('Failed to handle friend request. Please try again.');
                    window.location.reload();
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error handling friend request:', error);
                // setError('Error handling friend request. Please try again.');
                setLoading(false);
            });
    };

    // CRUSH-API
    const handleSetCrush = () => {
        setLoading(true);

        fetch(`${config.apiUrl}/crushes/public/crushesRequest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: userUUID,
                receiverId: profileUUID,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 422) {
                    message.error('Cannot send a crush request to this profile');
                } else {
                    throw new Error('Failed to handle crush request');
                }
            })
            .then((responseData) => {
                if (responseData.success) {
                    setCrushAdded((prevStatus) => responseData.status === '2');

                    fetch(`${config.apiUrl}/crushes/get/public/crushesRequest/${profileUUID}`)
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
                    // setError('Failed to handle crush request. Please try again.');
                    window.location.reload();
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error handling crush request:', error);
                // setError('Error handling crush request. Please try again.');
                setLoading(false);
            });
    };

    // IGNORE-API
    const handleAddToIgnore = () => {
        setLoading(true);

        fetch(`${config.apiUrl}/ignores/public/ignoreRequest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: userUUID,
                receiverId: profileUUID,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 422) {
                    message.error("You can't ignore your own profile");
                } else {
                    throw new Error('Failed to handle ignore request');
                }
            })
            .then((responseData) => {
                if (responseData.success) {
                    setIgnored((prevStatus) => responseData.status === '2');

                    fetch(`${config.apiUrl}/ignores/get/public/ignoreRequest/${profileUUID}`)
                        .then((ignoreResponse) => {
                            if (!ignoreResponse.ok) {
                                throw new Error(`Ignore status request failed: ${ignoreResponse.status}`);
                            }
                            return ignoreResponse.json();
                        })
                        .then((ignoreData) => {
                            if (ignoreData.success) {
                                setIgnored((prevStatus) => ignoreData.status);
                            }
                        })
                        .catch((error) => {
                            console.error('Error fetching data after POST:', error.message);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    console.error('Failed to handle ignore request');
                    // setError('Failed to handle ignore request. Please try again.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error handling ignore request:', error);
                // setError('Error handling ignore request. Please try again.');
                window.location.reload();
                setLoading(false);
            });
    };

    const handleMessage = () => {
        navigate('/chat');
    };


    const buttonStyle = {
        fontSize: '14px',
        color: colors.textColor,
        backgroundColor: friendRequestStatus === "1" ? colors.backgroundColor : colors.backgroundColor,
        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
        marginLeft: '5px',
        marginRight: '5px'
    };

    const getTextForFriendButton = (status) => {
        switch (status) {
            case "1":
                return `Friend Request Sent`;
            case "2":
                return 'You are now Friends';
            default:
                return 'Add as Friend';
        }
    };

    const getTextForCrushButton = (status) => {
        switch (status) {
            case "1":
                return 'Crush';
            case "2":
                return 'You have a new Crush';
            default:
                return 'Crush';
        }
    };

    const getTextForIgnoreButton = (status) => {
        switch (status) {
            case "1":
                return 'Ignore';
            case "2":
                return 'You have Ignored';
            default:
                return 'Ignore';
        }
    };

    return (
        <div>
            <div>
                {loading && <p>
                    <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </p>}
                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

                {!loading && !error && (
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>

                            {/* Add to Friend Button */}
                            <Tooltip title={`Add ${username} as Friend`} arrow>
                                <IconButton
                                    className='rounded-1'
                                    style={buttonStyle}
                                    onClick={handleAddToFriend}
                                >
                                    {getTextForFriendButton(friendRequestStatus)}
                                </IconButton>
                            </Tooltip>

                            {/* Send Message Button */}
                            {friendRequestStatus === "2" && (
                                <IconButton
                                    className='rounded-1'
                                    style={buttonStyle}
                                    onClick={() => handleMessage()}
                                >
                                    Message
                                </IconButton>
                            )}

                            {/* Set Crush Button */}
                            <Tooltip title={`Add ${username} as Crush`} arrow>
                                <IconButton
                                    className='rounded-1'
                                    style={buttonStyle}
                                    onClick={handleSetCrush}
                                >
                                    {getTextForCrushButton(isCrushAdded)}
                                </IconButton>
                            </Tooltip>

                            {/* Add to Ignore Button */}
                            <Tooltip title={`Add ${username} as Ignore`} arrow>
                                <IconButton
                                    className='rounded-1'
                                    style={buttonStyle}
                                    onClick={handleAddToIgnore}
                                >
                                    {getTextForIgnoreButton(isIgnored)}
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default PublicFriendHandling;