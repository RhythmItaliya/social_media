// ReceiverComponent.js

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Done, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import StyledIconButton from '@material-ui/core/IconButton';
import { useDarkMode } from '../theme/Darkmode';

import './abc.css';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
};

const ReceiverComponent = () => {
    const receiverUUID = useSelector((state) => state.profileuuid.uuid);
    const [receiverData, setReceiverData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friendRequestAccepted, setFriendRequestAccepted] = useState(false);
    const [firstProcessedData, setFirstProcessedData] = useState(null);
    const [isHidden, setIsHidden] = useState(false);

    const { isDarkMode } = useDarkMode();

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        const fetchReceiverData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/friendRequests/${receiverUUID}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error('Friend Requests Request failed');
                    throw new Error('Friend Requests Request failed');
                }

                const data = await response.json();
                console.log(data);
                const firstProcessedData = data[0];
                setFirstProcessedData(firstProcessedData);

                if (firstProcessedData) {
                    const receiverResponse = await fetch(`http://localhost:8080/api/user/profile/receiver/${firstProcessedData.sender.uuid}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!receiverResponse.ok) {
                        console.error('Receiver Data Request failed');
                        throw new Error('Receiver Data Request failed');
                    }

                    const receiverData = await receiverResponse.json();
                    setReceiverData(receiverData);
                }

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchReceiverData();
    }, [receiverUUID]);

    const handleAcceptFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:8080/friendRequests/${receiverUUID}/accept`, {
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

            setFriendRequestAccepted(true);
            setIsHidden(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectFriendRequest = async () => {
        try {
            const response = await fetch(`http://localhost:8080/delete/friend/request/${firstProcessedData.uuid}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Reject Friend Request Request failed');
                throw new Error('Reject Friend Request Request failed');
            }

            setFriendRequestAccepted(false);
            setIsHidden(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CSSTransition
            in={!isHidden}
            timeout={500}
            classNames="fade"
            unmountOnExit
        >
            <div className='' style={{ border: `1px solid ${isDarkMode ? darkModeColors.border : lightModeColors.border}` }}>
                {loading && <p>Loading...</p>}
                {!loading && receiverData && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {receiverData.completeImageUrl && <Avatar alt="Receiver Photo" src={receiverData.completeImageUrl} />}

                        <p style={{ color: colors.textColor }} className='m-4'>
                            {receiverData.firstName} {receiverData.lastName}
                            <br />
                            <span style={{ margin: '0', color: '#707070', fontSize: '12px' }}>
                                asdfghj
                            </span>
                        </p>

                        {!friendRequestAccepted && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <StyledIconButton
                                    color="inherit" style={{ color: colors.iconColor }}
                                    onClick={handleAcceptFriendRequest}>
                                    <Done fontSize="small" />
                                </StyledIconButton>

                                <StyledIconButton
                                    color="inherit" style={{ color: colors.iconColor }}
                                    onClick={handleRejectFriendRequest}>
                                    <Close fontSize="small" />
                                </StyledIconButton>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </CSSTransition >
    );
};

export default ReceiverComponent;
