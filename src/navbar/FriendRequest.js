// FriendRequest.js
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import './abc.css';

const FriendRequest = () => {
    const [photoURL, setPhotoURL] = useState(null);
    const [username, setUsername] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [socket, setSocket] = useState(null);
    const [socketId, setSocketId] = useState('');
    const [friendRequests, setFriendRequests] = useState([]);

    const uuid = useSelector((state) => state.profileuuid.uuid);

    useEffect(() => {
        // Connect to the Socket.IO server
        const socketInstance = io('http://localhost:8080');

        // Listen for the connect event
        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id);
            setSocketId(socketInstance.id);
        });

        // Listen for friend request events from the server
        socketInstance.on('friendRequest', (receivedFriendRequest) => {
            console.log('Friend request received:', receivedFriendRequest);

            // Update the state with the received friend request
            setFriendRequests((prevFriendRequests) => [...prevFriendRequests, receivedFriendRequest]);
        });

        // Listen for any errors or debugging information from the server
        socketInstance.on('serverMessage', (message) => {
            console.log('Server message:', message);
        });

        // Store the socket instance in the state
        setSocket(socketInstance);

        // Cleanup the socket connection on component unmount
        return () => {
            console.log('Socket disconnected');
            socketInstance.disconnect();
        };
    }, []);

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

    const handleSendRequest = () => {
        console.log(`Friend request sent to ${username}`);

        // Emit a friend request event to the server
        socket.emit('sendFriendRequest', { senderId: uuid, receiverId });

        // You can update the UI or take other actions immediately (optimistically)
        // since the server will also send a real-time update
    };

    return (
        <>
            <div className="profile-container bg-black">
                <Avatar className="avatar-wrapper" alt="User Avatar" src={`http://static.profile.local/${photoURL}`} />
                <div className="username p-2 bg-black">{username}</div>
                <Button className="send-request-button" onClick={handleSendRequest}>
                    Send Request
                </Button>
                <div>Socket ID: {socketId}</div>

                {friendRequests.map((request) => (
                    <div key={request.id}>Friend Request from {request.senderId}</div>
                ))}
            </div>
        </>
    );
};

export default FriendRequest;
