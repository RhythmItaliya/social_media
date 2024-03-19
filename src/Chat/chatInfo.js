import io from 'socket.io-client';
import config from '../configuration';

const socket = io(`${config.apiUrl}`, {});

const connectSocket = () => {
  socket.on('connect', () => {
    console.log('Socket connected successfully!');
  });

  return socket;
};

export const joinRoom = (senderUuid, receiverUuid, updateMessages) => {
  const room = generateRoomId(senderUuid, receiverUuid);
  console.log(`Joining room: ${room}`);



  socket.emit('join-room', { room });

  const fetchMessages = async () => {
    try {
      if (receiverUuid) {
        const response = await fetch(`${config.apiUrl}/get-messages/${receiverUuid}`);
        const data = await response.json();


        if (response.ok) {
          const allMessages = [...data.messages];
          allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          updateMessages(allMessages || []);
        } else {
          console.error('Error fetching messages:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  const handleNewMessage = (newMessage) => {
    console.log('New message received:', newMessage);
    fetchMessages()
    // updateMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  socket.on('new-message', handleNewMessage);

  return { room, handleNewMessage };
};

export const leaveRoom = (room) => {
  socket.emit('leave-room', { room });
};

export const sendMessage = (senderUuid, receiverUuid, content, room) => {
  socket.emit('send-message', {
    senderUuid,
    receiverUuid,
    content,
    room,
  });
};

// Function to generate a unique room ID based on two user UUIDs
export const generateRoomId = (uuid1, uuid2) => {
  // Sort UUIDs to ensure consistent room ID regardless of order
  const sortedUUIDs = [uuid1, uuid2].sort();
  return `${sortedUUIDs[0]}-${sortedUUIDs[1]}`;
};

export default connectSocket();
