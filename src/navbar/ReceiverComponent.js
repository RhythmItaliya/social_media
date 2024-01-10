// ReceiverComponent.js

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Done, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import StyledIconButton from '@material-ui/core/IconButton';
import { useDarkMode } from '../theme/Darkmode';
import { ScaleLoader } from 'react-spinners';

import './abc.css';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff',
};


const ReceiverComponent = () => {
    const receiverUUID = useSelector((state) => state.profileuuid.uuid);
    const [loading, setLoading] = useState(true);
    const [receiverData, setReceiverData] = useState([]);
    const [friendRequestVisibility, setFriendRequestVisibility] = useState({});
    const [renderIndex, setRenderIndex] = useState(0);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        const fetchReceiverData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/friendRequests/${receiverUUID}`, {
                    method: 'GET',
                    credentials: 'include',
                });


                if (response.status === 404) {
                    // Handle 404 error (Result not found)
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    console.error('Friend Requests Request failed');
                    throw new Error('Friend Requests Request failed');
                }

                const data = await response.json();

                // Simulate a minimum loading time of 1000 milliseconds (adjust as needed)
                setTimeout(() => {
                    // Accumulate friend request data into an array
                    const processedData = data.map((friendRequestInfo, index) => {
                        const friendRequestUuid = friendRequestInfo.friendRequest.uuid;
                        const senderUuid = friendRequestInfo.friendRequest.sender.uuid;
                        const receiverUuid = friendRequestInfo.friendRequest.receiver.uuid;
                        const firstName = friendRequestInfo.senderProfile.firstName;
                        const lastName = friendRequestInfo.senderProfile.lastName;
                        const imageUrl = friendRequestInfo.senderProfile.completeImageUrl;

                        return {
                            friendRequestUuid,
                            senderUuid,
                            receiverUuid,
                            firstName,
                            lastName,
                            imageUrl,
                        };
                    });

                    // Initialize visibility state for each friend request
                    const initialVisibility = processedData.reduce((acc, data) => {
                        acc[data.friendRequestUuid] = false;
                        return acc;
                    }, {});
                    setFriendRequestVisibility(initialVisibility);

                    if (processedData.length === 0) {
                        // No friend requests found, handle this case if needed
                        console.log('No friend requests found.');
                        setLoading(false);
                        return;
                    }

                    // Set the processed data once outside the loop
                    setReceiverData(processedData);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReceiverData();
    }, [receiverUUID]);

    useEffect(() => {
        // This effect controls the rendering of items one after another
        const timer = setTimeout(() => {
            setRenderIndex((prevIndex) => prevIndex + 1);
        }, 700); // Adjust the delay between items as needed

        return () => clearTimeout(timer);
    }, [renderIndex]);

    const handleAcceptFriendRequest = async (friendRequestUuid) => {
        try {
            const response = await fetch(`http://localhost:8080/friendRequests/${friendRequestUuid}/accept`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Accept Friend Request Request failed');
                throw new Error('Accept Friend Request Request failed');
            }

            // Set visibility to true only for the accepted friend request
            setFriendRequestVisibility((prevVisibility) => ({
                ...prevVisibility,
                [friendRequestUuid]: true,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectFriendRequest = async (friendRequestUuid) => {
        try {
            const response = await fetch(`http://localhost:8080/delete/friend/request/${friendRequestUuid}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Reject Friend Request Request failed');
                throw new Error('Reject Friend Request Request failed');
            }

            // Set visibility to true only for the rejected friend request
            setFriendRequestVisibility((prevVisibility) => ({
                ...prevVisibility,
                [friendRequestUuid]: true,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='p-3'>
            <p style={{ color: colors.textColor }}>Friend Request</p>
            {loading && (
                <div className="loading-spinner">
                    <ScaleLoader color={colors.spinnerColor} loading={loading} height={15} />
                </div>
            )}
            {!loading && receiverData.length === 0 && (
                <p style={{ color: colors.textColor }}>
                    {receiverData.length === 0 ? 'No friend requests found.' : 'Result not found.'}
                </p>
            )}
            {!loading && receiverData.length > 0 && (
                receiverData.slice(0, renderIndex).map((data, index) => (
                    <CSSTransition
                        key={index}
                        in={!friendRequestVisibility[data.friendRequestUuid]}
                        timeout={500}
                        classNames="fade"
                        unmountOnExit
                    >
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: `1px solid ${isDarkMode ? darkModeColors.border : lightModeColors.border}`,
                            }}>
                                {data.imageUrl && <Avatar alt="Receiver Photo" src={data.imageUrl} />}

                                <p style={{ color: colors.textColor }} className='m-4'>
                                    {data.firstName} {data.lastName}
                                    <br />
                                    <span style={{ margin: '0', color: '#707070', fontSize: '12px' }}>
                                        asdfghj
                                    </span>
                                </p>

                                {!friendRequestVisibility[data.friendRequestUuid] && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}>
                                        <StyledIconButton
                                            color="inherit" style={{ color: colors.iconColor }}
                                            onClick={() => handleAcceptFriendRequest(data.friendRequestUuid)}>
                                            <Done fontSize="small" />
                                        </StyledIconButton>

                                        <StyledIconButton
                                            color="inherit" style={{ color: colors.iconColor }}
                                            onClick={() => handleRejectFriendRequest(data.friendRequestUuid)}>
                                            <Close fontSize="small" />
                                        </StyledIconButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CSSTransition>
                ))
            )}
        </div>
    );
};

export default ReceiverComponent;