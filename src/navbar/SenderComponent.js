import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const SenderComponent = () => {
    const uuid = useSelector((state) => state.profileuuid.uuid);
    const [userProfiles, setUserProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user profiles
        fetch(`http://localhost:8080/api/userProfiles/${uuid}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.userProfiles && data.userProfiles.length > 0) {
                    setUserProfiles(data.userProfiles);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false); // Set loading to false after data is fetched or in case of error
            });
    }, [uuid]);

    const sendFriendRequest = async (receiverId) => {
        try {
            // Make a POST request to your backend endpoint to send the friend request
            const response = await fetch('http://localhost:8080/friendRequests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: uuid,
                    receiverId: receiverId,
                }),
            });

            if (response.ok) {
                // Friend request sent successfully, you can handle the UI accordingly
                console.log('Friend request sent successfully');
            } else {
                // Handle error scenarios
                console.error('Failed to send friend request');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    return (
        <div className="profile-container bg-black">
            {loading ? (
                <p>Loading...</p>
            ) : (
                userProfiles.map((profile) => (
                    <div key={profile.uuid} className="profile-item">
                        <Avatar className="avatar-wrapper" alt="User Avatar" src={`http://static.profile.local/${profile.photoURL}`} />
                        <div className="username p-2 bg-black">{profile.username}</div>
                        <Button
                            className="send-request-button"
                            onClick={() => sendFriendRequest(profile.uuid)}
                        >
                            Send Request
                        </Button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SenderComponent;