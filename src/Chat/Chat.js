// Chat.js
import React, { useState } from 'react';
import UserChatList from './UserChatList';
import ChatWindow from './ChatWindow';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '350px' }}>
        <UserChatList
          onSelectUser={(user) => {
            console.log(`Selected user: ${user.firstName} ${user.lastName}`);
            setSelectedUser(user);
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Chat;
