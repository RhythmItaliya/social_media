import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';

const ReceiverComponent = () => {
    const receiverUUID = useSelector((state) => state.profileuuid.uuid);
    const [receiverData, setReceiverData] = useState(null);
    const [userPhotoUrl, setUserPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch friend requests
        fetch(`http://localhost:8080/friendRequests/${receiverUUID}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                // Process friend request data
                const processedData = data.map((friendRequest) => {
                    const { uuid, sender, receiver } = friendRequest;
                    return {
                        uuid,
                        sender: sender.uuid,
                        receiver: receiver.uuid,
                    };
                });

                // Take the first processed data
                const firstProcessedData = processedData[0];
                if (firstProcessedData) {
                    setReceiverData(firstProcessedData.receiver);
                    setLoading(false); // Set loading to false after data is fetched
                }
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // Set loading to false in case of error
            });
    }, [receiverUUID]);

    useEffect(() => {
        const fetchReceiverData = async () => {
            try {
                if (!receiverData) {
                    // Receiver data is not available yet, you may want to handle this case
                    return;
                }

                // Fetch receiver data using the processed receiver UUID
                const response = await fetch(`http://localhost:8080/api/user/profile/receiver/${receiverData}`, {
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
                setReceiverData(data);

                setUserPhotoUrl(data.completeImageUrl);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReceiverData();
    }, [receiverData]);

    return (
        <div>
            <h2>Pending Friend Requests</h2>
            {loading && <p>Loading...</p>}
            {!loading && receiverData && (
                <div>
                    {userPhotoUrl && <Avatar alt="Receiver Photo" src={userPhotoUrl} />}
                    <p>{receiverData.firstName} {receiverData.lastName}</p>
                </div>
            )}
        </div>
    );
};

export default ReceiverComponent;
