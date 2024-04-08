import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Done, Close, RefreshSharp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { ScaleLoader } from 'react-spinners';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import './abc.css';
import config from '../configuration';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};


const ReceiverComponent = ({ colors }) => {
    const receiverUUID = useSelector((state) => state.profileuuid.uuid);
    const [loading, setLoading] = useState(true);
    const [receiverData, setReceiverData] = useState([]);
    const [friendRequestVisibility, setFriendRequestVisibility] = useState({});
    const [renderIndex, setRenderIndex] = useState(0);

    useEffect(() => {
        fetchReceiverData();
    }, [receiverUUID]);

    useEffect(() => {
        setRenderIndex((prevIndex) => prevIndex + 1);
    }, [receiverUUID]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/friends/friendRequests/${receiverUUID}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 404) {
                setReceiverData([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                console.error('Friend Requests Request failed');
                throw new Error('Friend Requests Request failed');
            }

            const data = await response.json();

            const processedData = data.map((friendRequestInfo, index) => {
                const friendRequestUuid = friendRequestInfo.friendRequest.uuid;
                const senderUuid = friendRequestInfo.friendRequest.sender.uuid;
                const receiverUuid = friendRequestInfo.friendRequest.receiver.uuid;
                const firstName = friendRequestInfo.senderProfile.firstName;
                const lastName = friendRequestInfo.senderProfile.lastName;
                const imageUrl = friendRequestInfo.senderProfile.completeImageUrl;
                const username = friendRequestInfo.senderProfile.username;

                return {
                    friendRequestUuid,
                    senderUuid,
                    receiverUuid,
                    firstName,
                    lastName,
                    imageUrl,
                    username
                };
            });

            const initialVisibility = processedData.reduce((acc, data) => {
                acc[data.friendRequestUuid] = false;
                return acc;
            }, {});
            setFriendRequestVisibility(initialVisibility);

            setReceiverData(processedData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };


    const fetchReceiverData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/friends/friendRequests/${receiverUUID}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 404) {
                setLoading(false);
                return;
            }

            if (!response.ok) {
                console.error('Friend Requests Request failed');
                throw new Error('Friend Requests Request failed');
            }

            const data = await response.json();

            const processedData = data.map((friendRequestInfo, index) => {
                const friendRequestUuid = friendRequestInfo.friendRequest.uuid;
                const senderUuid = friendRequestInfo.friendRequest.sender.uuid;
                const receiverUuid = friendRequestInfo.friendRequest.receiver.uuid;
                const firstName = friendRequestInfo.senderProfile.firstName;
                const lastName = friendRequestInfo.senderProfile.lastName;
                const imageUrl = friendRequestInfo.senderProfile.completeImageUrl;
                const username = friendRequestInfo.senderProfile.username;

                return {
                    friendRequestUuid,
                    senderUuid,
                    receiverUuid,
                    firstName,
                    lastName,
                    imageUrl,
                    username
                };

            });

            const initialVisibility = processedData.reduce((acc, data) => {
                acc[data.friendRequestUuid] = false;
                return acc;
            }, {});
            setFriendRequestVisibility(initialVisibility);

            if (processedData.length === 0) {
                console.log('No friend requests found.');
                setLoading(false);
                return;
            }

            setReceiverData(processedData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleAcceptFriendRequest = async (friendRequestUuid) => {
        try {
            const response = await fetch(`${config.apiUrl}/friendRequests/${friendRequestUuid}/accept`, {
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

            const updatedData = receiverData.filter((data) => data.friendRequestUuid !== friendRequestUuid);

            setReceiverData(updatedData);

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
            const response = await fetch(`${config.apiUrl}/delete/friend/request/${friendRequestUuid}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Reject Friend Request Request failed');
                throw new Error('Reject Friend Request Request failed');
            }

            const updatedData = receiverData.filter((data) => data.friendRequestUuid !== friendRequestUuid);

            setReceiverData(updatedData);

            setFriendRequestVisibility((prevVisibility) => ({
                ...prevVisibility,
                [friendRequestUuid]: true,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    function capitalizeFirstLetter(str) {
        if (typeof str !== 'undefined' && str !== null && str.length > 0) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return '';
    }

    return (
        <div
            className='mt-5 p-1 overflow-y-scroll w-100'
            style={{
                height: '700px',
                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            }}>

            <div className='py-3 d-flex justify-content-between align-items-center' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, }}>
                <div className='d-flex align-items-center justify-content-center'>
                    <p className='m-2' style={{ color: "#ec1b90" }}>Friend Request</p>
                </div>
                <div>
                    <IconButton style={{ color: colors.iconColor }} onClick={handleRefresh}>
                        <RefreshSharp />
                    </IconButton>
                </div>
            </div>

            {
                loading && (
                    <div className="loading-spinner">
                        <p style={{ color: colors.textColor }}>
                            <div className="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </p>
                    </div>
                )
            }
            {
                !loading && receiverData.length === 0 && (
                    <p className='p-2' style={{ color: colors.textColor }}>
                        {receiverData.length === 0 ? 'No friend requests found.' : 'Result not found.'}
                    </p>
                )
            }
            {
                !loading && receiverData.length > 0 && (
                    receiverData.map((data, index) => (
                        <div
                            key={index}
                            className='d-flex m-2 p-2 gap-3 justify-content-around align-items-center'
                            style={{
                                borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                            }}>

                            {/* avatar */}
                            <Grid item xs={4}>
                                <div className='avatar-container' style={{ cursor: 'pointer' }}>
                                    {data.imageUrl ? (
                                        <Avatar
                                            className="avatar-wrapper"
                                            src={`${data.imageUrl}`}
                                            style={{
                                                width: '35px',
                                                height: '35px'
                                            }}
                                        />
                                    ) : (
                                        <Avatar
                                            className="avatar-wrapper"
                                            style={{
                                                width: '35px',
                                                height: '35px'
                                            }}
                                        />
                                    )}
                                </div>
                            </Grid>

                            {/* info */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <p style={{ color: colors.textColor, margin: '0' }}>
                                    <span style={{ margin: '0', color: colors.textColor, fontSize: '14px' }}>
                                        {capitalizeFirstLetter(data.firstName)} {capitalizeFirstLetter(data.lastName)}
                                    </span>
                                    <br />
                                    <span style={{ margin: '0', color: colors.labelColor, fontSize: '12px' }}>
                                        {/* {data.username} */}
                                    </span>
                                </p>
                            </div>

                            {/* button */}
                            {!friendRequestVisibility[data.friendRequestUuid] && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton
                                        color="inherit" style={{ color: colors.iconColor }}
                                        onClick={() => handleAcceptFriendRequest(data.friendRequestUuid)}>
                                        <Done fontSize="small" />
                                    </IconButton>

                                    <IconButton
                                        color="inherit" style={{ color: colors.iconColor }}
                                        onClick={() => handleRejectFriendRequest(data.friendRequestUuid)}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </div>
                    ))
                )
            }
        </div >
    );
};

export default ReceiverComponent;