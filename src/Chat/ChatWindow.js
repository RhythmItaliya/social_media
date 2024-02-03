//ChatWindow.js
import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { useSelector } from 'react-redux';
import { joinRoom, leaveRoom, sendMessage } from './chatInfo';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';


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
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const senderUuid = useSelector((state) => state.profileuuid.uuid);
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  useEffect(() => {
    let room;

    const fetchMessages = async () => {
      try {
        if (selectedUser) {
          setMessages([]);
          room = joinRoom(senderUuid, selectedUser.uuid, setMessages);

          // Fetch messages for the selected user
          const response = await fetch(`http://localhost:8080/get-messages/${selectedUser.uuid}`);
          const data = await response.json();

          if (response.ok) {
            setMessages(data.messages);
          } else {
            console.error('Error fetching messages:', data.error);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      if (room) {
        leaveRoom(generateRoomId(senderUuid, selectedUser.uuid));
      }
    };
  }, [selectedUser, senderUuid]);


  const handleSendMessage = async () => {
    const room = generateRoomId(senderUuid, selectedUser.uuid);

    try {
      await sendMessage(senderUuid, selectedUser.uuid, newMessage, room);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to generate a unique room ID based on two user UUIDs
  const generateRoomId = (uuid1, uuid2) => {
    // Sort UUIDs to ensure consistent room ID regardless of order
    const sortedUUIDs = [uuid1, uuid2].sort();
    return `${sortedUUIDs[0]}-${sortedUUIDs[1]}`;
  };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {selectedUser && (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
          {/* Display Avatar */}
          <Avatar
            src={selectedUser.photoURL}  // Replace with the actual property for the avatar URL
            alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
          />

          {/* Display User's Full Name and Last Seen */}
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: colors.textColor }}>
              {selectedUser.firstName.charAt(0).toUpperCase() + selectedUser.firstName.slice(1)} {selectedUser.lastName.charAt(0).toUpperCase() + selectedUser.lastName.slice(1)}
            </div>
            <div style={{ fontSize: '12px', color: colors.textColor }}>
              Last seen {selectedUser.lastMessage.timestamp ? formatTimestamp(selectedUser.lastMessage.timestamp) : ''}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', border: `1px solid ${colors.border}`, padding: '10px' }}>
        {messages.map((message, index) => (
          (index === 0 || messages[index - 1].content !== message.content) && (
            <div
              key={index}
              style={{
                marginBottom: '8px',
                color: colors.textColor,
                textAlign: message.senderUuid === senderUuid ? 'right' : 'left',
              }}
            >
              <span style={{ fontWeight: 'bold', color: message.senderUuid === senderUuid ? '#4CAF50' : '#2196F3' }}>
                {message.senderUuid === senderUuid ? 'You' : ''}
              </span>
              {message.content}
            </div>
          )
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <TextField
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%', padding: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundColor, color: colors.textColor }}
        />
        <Button
          onClick={handleSendMessage}
          variant="contained"
          style={{ width: '18%', padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default ChatWindow;