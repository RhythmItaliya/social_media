import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const SenderComponent = () => {
    const uuid = useSelector((state) => state.profileuuid.uuid);
    const [photoURL, setPhotoURL] = useState('');
    const [username, setUsername] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user profile data
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
                    setLoading(false); // Set loading to false after data is fetched
                }
            })
            .catch((error) => {
                console.error(error);
                setLoading(false); // Set loading to false in case of error
            });
    }, [uuid]);

    const sendFriendRequest = async () => {
        try {
            setLoading(true); // Set loading to true before making the request

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
        } finally {
            setLoading(false); // Set loading to false after the request is complete (whether success or failure)
        }
    };

    return (
        <div className="profile-container bg-black">
            {loading && <p>Loading...</p>}
            {!loading && (
                <>
                    <Avatar className="avatar-wrapper" alt="User Avatar" src={`http://static.profile.local/${photoURL}`} />
                    <div className="username p-2 bg-black">{username}</div>
                    <Button className="send-request-button" onClick={sendFriendRequest}>
                        Send Request
                    </Button>
                </>
            )}
        </div>
    );
};

export default SenderComponent;
