// Chat.js
import React, { useState } from 'react';
import UserChatList from './UserChatList';
import ChatWindow from './ChatWindow';
import './chat.css';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: 'flex' }} className="chat-container">
      <div style={{ width: '350px' }} className='chat-width'>
        <UserChatList
          onSelectUser={(user) => {
            console.log(`Selected user: ${user.firstName} ${user.lastName}`);
            setSelectedUser(user);
          }}
        />
      </div>
      <div style={{ flex: 1 }} className="chat-window-container">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Chat;