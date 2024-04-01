//UserChatList.js
import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { useSelector } from 'react-redux';
import { joinRoom, leaveRoom, sendMessage } from './chatInfo';
import { Avatar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './chat.css';
import config from '../configuration';

const lightModeColors = {
  backgroundColor: '#ffffff',
  iconColor: 'rgb(0,0,0)',
  textColor: 'rgb(0,0,0)',
  focusColor: 'rgb(0,0,0)',
  border: '#CCCCCC',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
  spinnerColor: 'rgb(0,0,0)',
  labelColor: '#8e8e8e',
  valueTextColor: 'rgb(0,0,0)',
  linkColor: '#000',
  hashtagColor: 'darkblue',
  transparentColor: 'rgba(255, 255, 255, 0.5)',
  activeTransparentColor: 'rgba(0, 0, 0, 0.1)'
};

const darkModeColors = {
  backgroundColor: 'rgb(0,0,0)',
  iconColor: '#ffffff',
  textColor: '#ffffff',
  focusColor: '#ffffff',
  border: '#333333',
  boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
  spinnerColor: '#ffffff',
  labelColor: '#CCC',
  valueTextColor: '#ffffff',
  linkColor: '#CCC8',
  hashtagColor: '#8A2BE2',
  transparentColor: 'rgba(255, 255, 255, 0.5)',
  activeTransparentColor: 'rgba(255, 255, 255, 0.1)'
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const UserChatList = ({ onSelectUser }) => {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const profileUuid = useSelector((state) => state.profileuuid.uuid);

  const [friendsList, setFriendsList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchInput, setSearchInput] = useState('');

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
  };

  // Find_friend
  useEffect(() => {
    async function fetchFriendsList() {
      try {
        const response = await fetch(`${config.apiUrl}/api/friendships/users/${profileUuid}`);
        const data = await response.json();

        if (response.ok) {
          const fetchedFriendsList = data.friends;

          // Fetch last message for each friend
          const friendsWithLastMessage = await Promise.all(
            fetchedFriendsList.map(async (friend) => {
              const lastMessageResponse = await fetch(`${config.apiUrl}/chat/get-last-message/${friend.uuid}`);
              const lastMessageData = await lastMessageResponse.json();
              const lastMessage = lastMessageData.lastMessage;

              return {
                ...friend,
                lastMessage,
              };
            })
          );

          setFriendsList(friendsWithLastMessage);
          console.log(friendsWithLastMessage)
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

    onSelectUser(user);

    if (selectedUser) {
      leaveRoom(generateRoomId(profileUuid, selectedUser.uuid));
    }

    const newRoomId = generateRoomId(profileUuid, user.uuid);

    joinRoom(profileUuid, user.uuid, (newMessages) => {

      // setMessages(newMessages);
    });

    setSelectedUser(user);
  };

  const generateRoomId = (uuid1, uuid2) => {
    // Sort UUIDs to ensure consistent room ID regardless of order
    const sortedUUIDs = [uuid1, uuid2].sort();
    return `${sortedUUIDs[0]}-${sortedUUIDs[1]}`;
  };

  // Filter friendsList based on searchInput
  const filteredFriendsList = friendsList.filter((friend) => {
    const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
    return fullName.includes(searchInput.toLowerCase());
  });

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      width: '100%',
      padding: '10px',
      borderRight: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
    }}>
      <div className='w-100'>
        <h4 style={{ color: colors.textColor, padding: '10px' }}>Chats</h4>
      </div>

      <div>
        <div style={{ padding: '10px' }}>
          <div className="rounded-2 input-group">
            <span className="input-group-text" style={{
              justifyContent: "center",
              alignContent: 'center',
              display: "flex",
              cursor: 'pointer',
              backgroundColor: colors.backgroundColor,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 2px 4px rgba(${hexToRgb(colors.boxShadow)}, 0.1) inset`,
            }}>
              <SearchIcon
                sx={{
                  color: colors.iconColor,
                }} />
            </span>
            <input
              placeholder="Search messages or users"
              type="text"
              className="form-control form-control"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                backgroundColor: colors.backgroundColor,
                color: colors.textColor,
                border: `1px solid ${colors.border}`,
                boxShadow: `0 2px 4px rgba(${hexToRgb(colors.boxShadow)}, 0.1) inset`,
                fontSize: '14px',
                padding: '10px',
              }}
            />
          </div>
        </div>
      </div>

      {filteredFriendsList.length === 0 && (
        <div className='w-100 p-2 mt-3 rounded-2 text-center'
          style={{
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            color: colors.textColor,
            fontSize: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Typography style={{ color: colors.textColor }}>
            {searchInput.trim() === '' ? "Make some friends and start chatting!" : "No results found"}
          </Typography>
        </div>
      )}

      <ul className="p-1"
        style={{
          listStyleType: 'none',
        }}>
        {filteredFriendsList.map((friend) => (
          <li
            key={friend.uuid}
            style={{
              marginBottom: '10px',
              cursor: 'pointer',
              backgroundColor: selectedUser && selectedUser.uuid === friend.uuid ? colors.activeTransparentColor : colors.backgroundColor,
              color: selectedUser && selectedUser.uuid === friend.uuid ? colors.textColor : colors.textColor,
              padding: '2px',
              borderRadius: '5px'
            }}
            onClick={() => handleUserSelect(friend)}
          >
            <div className='d-flex gap-3 m-1 p-1 rounded-2'>
              <div className="d-flex justify-content-center align-content-center" style={{ flex: '20%' }}>
                <Avatar
                  src={friend.photoURL}
                  alt={`${friend.firstName}'s Avatar`}
                  style={{
                    width: '42px',
                    height: '42px'
                  }}
                />
              </div>
              <div style={{ flex: '80%' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="user-select-none" style={{ fontSize: "14px", color: colors.textColor, fontWeight: '500' }}>
                    {friend.firstName.charAt(0).toUpperCase() + friend.firstName.slice(1)}{' '}
                    {friend.lastName.charAt(0).toUpperCase() + friend.lastName.slice(1)}
                  </span>
                  <span className="user-select-none" style={{ fontSize: '10px', opacity: '0.8' }}>
                    {friend.lastMessage ? formatTimestamp(friend.lastMessage.timestamp) : ''}
                  </span>
                </div>
                {friend.lastMessage && (
                  <span className="user-select-none" style={{ fontSize: '12px', opacity: '0.9', color: colors.labelColor }}>
                    {''}
                    {friend.lastMessage.message}
                  </span>
                )}
                {!friend.lastMessage && (
                  <span className="user-select-none" style={{ fontSize: '12px', opacity: '0.9', color: colors.labelColor }}>
                    Start an awesome chat with @{friend.user.username} now!
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div >
  );
};

export default UserChatList;