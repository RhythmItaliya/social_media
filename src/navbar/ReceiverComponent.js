import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const ReceiverComponent = () => {
    const receiverUUID = useSelector((state) => state.profileuuid.uuid);
    const [receiverData, setReceiverData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friendRequestAccepted, setFriendRequestAccepted] = useState(false);

    const [firstProcessedData, setFirstProcessedData] = useState(null);

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
                const firstProcessedData = data[0];
                setFirstProcessedData(firstProcessedData);

                if (firstProcessedData) {
                    const receiverResponse = await fetch(`http://localhost:8080/api/user/profile/receiver/${firstProcessedData.receiver.uuid}`, {
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
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Pending Friend Requests</h2>
            {loading && <p>Loading...</p>}
            {!loading && receiverData && (
                <div>
                    {receiverData.completeImageUrl && <Avatar alt="Receiver Photo" src={receiverData.completeImageUrl} />}
                    <p>{receiverData.firstName} {receiverData.lastName}</p>
                    {!friendRequestAccepted && (
                        <div>
                            <Button variant="contained" color="primary" onClick={handleAcceptFriendRequest}>
                                Accept Friend Request
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleRejectFriendRequest}>
                                Reject Friend Request
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReceiverComponent;
