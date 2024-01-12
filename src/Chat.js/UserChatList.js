import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { useSelector } from 'react-redux';
import { joinRoom, leaveRoom, sendMessage } from './chatInfo';

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

const UserChatList = ({ onSelectUser }) => {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const profileUuid = useSelector((state) => state.profileuuid.uuid);

  const [friendsList, setFriendsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchFriendsList() {
      try {
        const response = await fetch(`http://localhost:8080/api/friendships/users/${profileUuid}`);
        const data = await response.json();

        if (response.ok) {
          const fetchedFriendsList = data.friends;
          setFriendsList(fetchedFriendsList);
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchFriendsList();
  }, [profileUuid]);

  const handleUserSelect = (user) => {
    console.log('Selected User:', user);

    // Pass the selected user's profile to onSelectUser
    onSelectUser(user);

    // Join the room with the selected user
    if (selectedUser) {
      leaveRoom(generateRoomId(profileUuid, selectedUser.uuid));
    }

    // Generate a unique room ID based on the two user UUIDs
    const newRoomId = generateRoomId(profileUuid, user.uuid);

    joinRoom(profileUuid, user.uuid, (newMessages) => {
      // You can use the newMessages as needed
      // setMessages(newMessages);
    });

    setSelectedUser(user);
  };

  // Function to generate a unique room ID based on two user UUIDs
  const generateRoomId = (uuid1, uuid2) => {
    // Sort UUIDs to ensure consistent room ID regardless of order
    const sortedUUIDs = [uuid1, uuid2].sort();
    return `${sortedUUIDs[0]}-${sortedUUIDs[1]}`;
  };

  return (
    <div style={{ width: '250px', backgroundColor: colors.backgroundColor, padding: '20px' }}>
      <h2 style={{ color: colors.textColor }}>User List</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {friendsList.map((friend) => (
          <li
            key={friend.uuid}
            style={{
              marginBottom: '10px',
              cursor: 'pointer',
              color: selectedUser && selectedUser.uuid === friend.uuid ? 'blue' : colors.textColor,
            }}
            onClick={() => handleUserSelect(friend)}
          >
            {friend.firstName} {friend.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserChatList;
