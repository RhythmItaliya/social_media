//ChatWindow.js
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

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const senderUuid = useSelector((state) => state.profileuuid.uuid);
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  useEffect(() => {
    let room;

    if (selectedUser) {
      room = joinRoom(senderUuid, selectedUser.uuid, setMessages);
    }

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

  return (


    <div style={{ flex: 1, padding: '20px', backgroundColor: colors.backgroundColor }}>
      <div style={{ height: '300px', overflowY: 'auto', border: `1px solid ${colors.border}`, padding: '10px' }}>

        {messages.map((message, index) => (
          // Check if the current message is not the same as the previous one
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
                {message.senderUuid === senderUuid}
              </span>
              {message.content}
            </div>
          )
        ))}

      </div>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px', color: colors.textColor }}>
          <strong>Selected User:</strong> {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.uuid})` : 'None'}
        </div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%', padding: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundColor, color: colors.textColor }}
        />
        <button
          onClick={handleSendMessage}
          style={{ width: '18%', padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
        >
          Send
        </button>
      </div>
    </div>
    
  );
};

export default ChatWindow;