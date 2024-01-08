// FriendRequest.js
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import './abc.css';

const FriendRequest = () => {
    const [photoURL, setPhotoURL] = useState(null);
    const [username, setUsername] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);
    const uuid = useSelector((state) => state.profileuuid.uuid);

    useEffect(() => {
        // Fetch user profile data when the UUID changes
        fetch(`http://localhost:8080/api/userProfiles/${uuid}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.userProfiles && data.userProfiles.length > 0) {
                    const firstUserProfile = data.userProfiles[0];
                    setPhotoURL(firstUserProfile.photoURL);
                    setUsername(firstUserProfile.username);
                    setReceiverId(firstUserProfile.uuid);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [uuid]);

    useEffect(() => {
        // Fetch friend requests for the receiver's UUID
        fetch(`http://localhost:8080/friendRequests/${receiverId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setFriendRequests(data); // Assuming the response is an array of friend requests
            })
            .catch((error) => {
                console.error('Error fetching friend requests:', error.message);
                // Handle error or update UI accordingly
            });
    }, [receiverId]); //

    const handleSendRequest = () => {
        console.log(`Friend request sent to ${username}`);

        // Make a POST request to the friend request API endpoint
        fetch('http://localhost:8080/friendRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                senderId: uuid,
                receiverId: receiverId,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Friend request failed');
                }
                return response.json();
            })
            .then((friendRequest) => {
                console.log('Friend request sent successfully:', friendRequest);
                // You can update the UI or take other actions if needed
            })
            .catch((error) => {
                console.error('Error sending friend request:', error.message);
                // Handle error or update UI accordingly
            });
    };

    const handleAcceptRequest = () => {
        console.log(`Friend request accepted for receiverId: ${receiverId}`);

        // Make a PUT request to accept friend request
        fetch(`http://localhost:8080/friendRequests/${receiverId}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to accept friend request');
                }
                return response.json();
            })
            .then((acceptedFriendRequest) => {
                console.log('Friend request accepted successfully:', acceptedFriendRequest);
                // You can update the UI or take other actions if needed
            })
            .catch((error) => {
                console.error('Error accepting friend request:', error.message);
                // Handle error or update UI accordingly
            });
    };

    return (
        <>
            <div className="profile-container bg-black">
                <Avatar className="avatar-wrapper" alt="User Avatar" src={`http://static.profile.local/${photoURL}`} />
                <div className="username p-2 bg-black">{username}</div>
                <Button className="send-request-button" onClick={handleSendRequest}>
                    Send Request
                </Button>

                {friendRequests.map((request) => (
                    <div key={request.id}>
                        Friend Request from {request.senderId}
                        <Button onClick={handleAcceptRequest}>
                            Accept Request
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FriendRequest;
