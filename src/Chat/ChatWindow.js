//ChatWindow.js
import React, { useEffect, useRef, useState } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { useSelector } from 'react-redux';
import { joinRoom, leaveRoom, sendMessage } from './chatInfo';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import { EmojiEmotions, SendAndArchiveOutlined } from '@mui/icons-material';

import EmojiPicker from 'emoji-picker-react';

import './chat.css';


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

// ChatWindow.js
const ChatWindow = ({ selectedUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const senderUuid = useSelector((state) => state.profileuuid.uuid);
  const receiverUUID = selectedUser?.uuid;
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;
  const [allMessages, setAllMessages] = useState([]);
  const senderPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);
  const senderUserUsername = useSelector((state) => state.name.username);
  const room = useRef(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiSelect = (emoji) => {
    const emojiUnicode = emoji.unified.split('-').map((code) => String.fromCodePoint(`0x${code}`)).join('');
    setNewMessage((prevMessage) => prevMessage + emojiUnicode);
    setSelectedEmoji(emojiUnicode);
    const inputElement = document.getElementById('chatInput');
    if (inputElement) {
      inputElement.value += emojiUnicode;
    }
  };




  const fetchMessages = async () => {
    try {
      if (selectedUser && receiverUUID) {
        const response = await fetch(`http://localhost:8080/get-messages/${receiverUUID}`);
        const data = await response.json();

        if (response.ok) {
          const allMessages = [...data.messages];
          allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setAllMessages(allMessages || []);
        } else {
          console.error('Error fetching messages:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  useEffect(() => {
    fetchMessages();
  }, [selectedUser, receiverUUID]);

  const handleSendMessage = async () => {
    const currentRoom = generateRoomId(senderUuid, receiverUUID);
    const messageToSend = selectedEmoji ? `${newMessage} ${selectedEmoji}` : newMessage;

    try {
      await sendMessage(senderUuid, receiverUUID, messageToSend, currentRoom);
      setNewMessage('');
      setSelectedEmoji(null);
    } catch (error) {
      console.error('Error sending message:', error);
      return;
    }

    setAllMessages((prevMessages) => [
      ...prevMessages,
      {
        content: messageToSend,
        sender: senderUuid,
        createdAt: new Date().toISOString(),
      },
    ]);
  };



  const joinChatRoom = () => {
    if (selectedUser && receiverUUID) {
      const currentRoom = generateRoomId(senderUuid, receiverUUID);
      room.current = joinRoom(senderUuid, receiverUUID, setAllMessages, currentRoom);
    }
  };

  const leaveChatRoom = () => {
    if (room.current) {
      leaveRoom(room.current);
    }
  };

  useEffect(() => {
    joinChatRoom();
    return () => {
      leaveChatRoom();
    };
  }, [selectedUser, senderUuid, receiverUUID]);



  const generateRoomId = (uuid1, uuid2) => {
    const sortedUUIDs = [uuid1, uuid2].sort();
    return `${sortedUUIDs[0]}-${sortedUUIDs[1]}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return null;
    }

    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
  };



  return (
    <div className='chatWindow' style={{ padding: '25px', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollBehavior: 'smooth' }}>
      {selectedUser ? (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '10px 10px 0 0', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }}>
          <Avatar src={selectedUser.photoURL} alt={`${selectedUser.firstName} ${selectedUser.lastName}`} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px', }} />
          <div style={{ cursor: 'default' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: colors.textColor }}>
              {selectedUser.firstName.charAt(0).toUpperCase() + selectedUser.firstName.slice(1)} {selectedUser.lastName.charAt(0).toUpperCase() + selectedUser.lastName.slice(1)}
            </div>
            <div style={{ fontSize: '12px', color: colors.textColor }}>
              Last seen {selectedUser.lastMessage ? (selectedUser.lastMessage.timestamp ? formatTimestamp(selectedUser.lastMessage.timestamp) : '') : ''}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: colors.textColor, marginTop: '10px' }}>
          Select a user to start a chat.
        </div>
      )}

      {selectedUser && (
        <div style={{ flex: 1, overflowY: 'auto', borderLeft: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, borderRight: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, padding: '10px' }}>
          {allMessages.slice().reverse().map((message, index) => (
            <div key={`message-${index}`} className={`d-flex flex-row justify-content-${message.sender === senderUuid ? 'end' : 'start'} mb-4`}>
              {message.sender !== senderUuid && (
                <Avatar src={selectedUser?.photoURL || ''} alt={`${selectedUser?.firstName} ${selectedUser?.lastName}`} style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              )}
              <div>
                <p className={`small p-2 ${message.sender === senderUuid ? 'me-3' : 'ms-3'} mb-1 rounded-3`} style={{ backgroundColor: message.sender === senderUuid ? 'bg-primary' : '#ccc', color: message.sender === senderUuid ? '#000' : '#fff' }}>
                  {message.content}
                  <p className="small mb-1 text-muted justify-content-end d-flex">{formatTimestamp(message.createdAt)}</p>
                </p>
              </div>
              {message.sender === senderUuid && (
                <Avatar src={senderPhotoUrl} alt={senderUserUsername} style={{ width: '20px', height: '20px', borderRadius: '50%', marginLeft: '5px' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className='col-12 d-flex' style={{ width: '100%', boxSizing: 'border-box' }}>
          <input
            id="chatInput"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{
              flex: '1',
              borderRadius: '0 0 0 10px',
              border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
              backgroundColor: colors.backgroundColor,
              color: colors.textColor,
              padding: '10px 10px',
              outline: 'none',
            }}
          />
          <IconButton
            variant="contained"
            style={{
              borderLeft: 'none',
              borderRight: 'none',
              padding: '10px',
              color: colors.textColor,
              borderRadius: '0',
              backgroundColor: colors.backgroundColor,
              border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
            }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <EmojiEmotions />
          </IconButton>

          {showEmojiPicker && (
            <div style={{ position: 'fixed', bottom: '70px', right: '10px', zIndex: '1', overflow: 'auto' }}>
              <EmojiPicker set='emojione' onSelect={handleEmojiSelect} />
            </div>
          )}

          <IconButton
            onClick={handleSendMessage}
            variant="contained"
            style={{
              borderLeft: 'none',
              padding: '10px 30px',
              color: colors.textColor,
              borderRadius: '0 0 10px 0',
              backgroundColor: colors.backgroundColor,
              border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
            }}
          >
            <SendAndArchiveOutlined />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;