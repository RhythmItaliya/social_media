import io from 'socket.io-client';

const socket = io('http://localhost:8080', {});

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

  const handleNewMessage = (newMessage) => {
    console.log('New message received:', newMessage);
    updateMessages((prevMessages) => [...prevMessages, newMessage]);
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
