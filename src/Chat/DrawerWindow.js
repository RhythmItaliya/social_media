//ChatWindow.js
import React, { useEffect, useRef, useState } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { useSelector } from 'react-redux';
import { joinRoom, leaveRoom, sendMessage } from './chatInfo';
import Avatar from '@mui/material/Avatar';
import { IconButton } from '@mui/material';
import { EmojiEmotions, SendAndArchiveOutlined } from '@mui/icons-material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import EmojiPicker from 'emoji-picker-react';

import './chat.css';
import config from '../configuration';
import { Link } from 'react-router-dom';


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
    transparentColor: 'rgba(255, 255, 255, 0.5)'

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
    transparentColor: 'rgba(255, 255, 255, 0.5)'

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

    console.log(selectedUser.user.username);

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

    const inputRef = useRef(null);
    const emojiButtonRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const [emojiButtonPosition, setEmojiButtonPosition] = useState(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedUser, senderUuid, receiverUUID]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiButtonRef.current &&
                emojiButtonRef.current.contains(event.target)
            ) {
                // Click occurred inside emoji button, do nothing
                return;
            }

            if (
                emojiPickerRef.current &&
                emojiPickerRef.current.contains(event.target)
            ) {
                // Click occurred inside emoji picker, do nothing
                return;
            }

            // Click occurred outside emoji button and picker, close picker
            setShowEmojiPicker(false);
        };

        // Add event listener when emoji picker is shown
        if (showEmojiPicker) {
            document.body.addEventListener('click', handleClickOutside);
        }

        // Clean up event listener
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, [showEmojiPicker]);


    const handleEmojiSelect = (emojiObject) => {
        // const emojiUnicode = emoji.unified.split('-').map((code) => String.fromCodePoint(`0x${code}`)).join('');
        setNewMessage((prevInput) => prevInput + emojiObject.emoji);
        // setSelectedEmoji(emojiUnicode);
        // const inputElement = document.getElementById('chatInput');
        // if (inputElement) {
        //   inputElement.value += emojiUnicode;
        // }
    };

    const fetchMessages = async () => {
        try {
            if (selectedUser && receiverUUID) {
                const response = await fetch(`${config.apiUrl}/chat/get-messages/${receiverUUID}`);
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
        fetchMessages()
        try {
            sendMessage(senderUuid, receiverUUID, messageToSend, currentRoom);
            setNewMessage('');
            setSelectedEmoji(null);
        } catch (error) {
            console.error('Error sending message:', error);
            return;
        }

        // setAllMessages((prevMessages) => [
        //   ...prevMessages,
        //   {
        //     content: messageToSend,
        //     sender: senderUuid,
        //     createdAt: new Date().toISOString(),
        //   },
        // ]);
    };



    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);

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

    // console.log("all messeges123", allMessages)

    // console.log("all messeges123", allMessages)
    const handleRemoveMessage = async (messageId) => {
        try {
            await fetch(`${config.apiUrl}/chat/delete-chat/${messageId}`, {
                credentials: 'include',
                method: 'DELETE',
            });

            // Update state to remove the message locally
            setAllMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
        } catch (error) {
            console.error('Error removing message:', error);
        }
    };

    return (
        <div className='chatWindow' style={{ padding: '12px', height: '500px', display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollBehavior: 'smooth' }}>
            {selectedUser ? (
                <div className='d-flex align-items-center justify-content-start p-2 gap-3' style={{ borderRadius: '10px 10px 0 0', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`, }}>
                    <div>
                        <Avatar src={selectedUser.photoURL}
                            alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                    <div style={{ cursor: 'pointer' }}>
                        <Link to={`/${selectedUser.user.username}`} style={{ textDecoration: 'none', color: colors.textColor }}>
                            <div className='d-flex flex-column align-content-center justify-content-start'>
                                <h6>{selectedUser.firstName.charAt(0).toUpperCase() + selectedUser.firstName.slice(1)} {selectedUser.lastName.charAt(0).toUpperCase() + selectedUser.lastName.slice(1)}</h6>
                                {/* <p style={{ color: colors.textColor, fontSize: '10px', margin: 0, padding: 0 }}>Last seen <span style={{ color: '#ec1b90' }}>{selectedUser.lastMessage ? (selectedUser.lastMessage.timestamp ? formatTimestamp(selectedUser.lastMessage.timestamp) : '') : ''}</span></p> */}
                                {selectedUser.lastMessage && selectedUser.lastMessage.timestamp ? (
                                    <p style={{ color: colors.textColor, fontSize: '10px', margin: 0, padding: 0 }}>
                                        Last seen <span style={{ color: '#ec1b90' }}>{formatTimestamp(selectedUser.lastMessage.timestamp)}</span>
                                    </p>
                                ) : null}
                            </div>
                        </Link>
                    </div>
                </div>
            ) : (
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: colors.textColor }}>Select a user to start a chat.</p>
                </div>
            )
            }

            {
                selectedUser && (
                    <div style={{ flex: 1, overflowY: 'auto', borderLeft: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, borderRight: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, padding: '10px' }}>
                        {allMessages.slice().reverse().map((message, index) => (
                            <div key={`message-${index}`} className={`d-flex flex-row justify-content-${message.sender === senderUuid ? 'end' : 'start'} mb-4`}>
                                {message.sender !== senderUuid && (
                                    <Avatar src={selectedUser?.photoURL || ''} alt={`${selectedUser?.firstName} ${selectedUser?.lastName}`} style={{ width: '30px', height: '30px', marginRight: '5px' }} />
                                )}
                                {/* <div><p className={`small p-2 ${message.sender === senderUuid ? 'me-3' : 'ms-3'} mb-1 rounded-3`} style={{ fontSize: '16px', backgroundColor: colors.backgroundColor, color: colors.textColor }}>{message.content}<span style={{ fontSize: '10px', backgroundColor: colors.backgroundColor, color: colors.textColor, opacity: '0.4' }} className="mb-1 justify-content-end d-flex">{formatTimestamp(message.createdAt)}</span></p></div> */}
                                <div>
                                    <p className={`small p-1 ${message.sender === senderUuid ? 'me-3' : 'ms-3'} mb-1 rounded-3`} style={{ fontSize: '16px', backgroundColor: colors.backgroundColor, color: colors.textColor }}>
                                        {message.sender === senderUuid ? (
                                            <>
                                                {message.content}
                                                {message.sender === senderUuid && (
                                                    <IconButton onClick={() => handleRemoveMessage(message.id)}>
                                                        <RemoveCircleOutlineIcon style={{ fontSize: '12px', color: '#ec1b90' }} />
                                                    </IconButton>
                                                )}
                                                <span style={{ fontSize: '10px', backgroundColor: colors.backgroundColor, color: colors.textColor, opacity: '0.4' }} className="mb-1 justify-content-end d-flex">{formatTimestamp(message.createdAt)}</span>
                                            </>
                                        ) : (
                                            <>
                                                {message.content}
                                                <span style={{ fontSize: '10px', backgroundColor: colors.backgroundColor, color: colors.textColor, opacity: '0.4' }} className="mb-1 justify-content-start d-flex">{formatTimestamp(message.createdAt)}</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                                {message.sender === senderUuid && (
                                    <Avatar src={senderPhotoUrl} alt={senderUserUsername} style={{ width: '30px', height: '30px', marginLeft: '5px', cursor: 'pointer' }} />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )
            }

            {
                selectedUser && (
                    <div className='col-12 d-flex' style={{ width: '100%', boxSizing: 'border-box' }}>

                        <IconButton
                            variant="contained"
                            style={{
                                borderLeft: 'none',
                                borderRight: 'none',
                                padding: '10px',
                                color: colors.textColor,
                                borderRadius: '0 0 0 10px',
                                backgroundColor: colors.backgroundColor,
                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
                            }}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            ref={emojiButtonRef}
                        >
                            <EmojiEmotions />
                        </IconButton>

                        {showEmojiPicker && (
                            <div
                                ref={emojiPickerRef}
                                style={{
                                    position: 'absolute',
                                    zIndex: '9999',
                                    overflow: 'auto',
                                    left: emojiButtonPosition ? `${emojiButtonPosition.left}px` : 'auto',
                                    bottom: emojiButtonPosition ? `calc(100vh - ${emojiButtonPosition.bottom}px)` : 'auto',
                                    top: emojiButtonPosition ? `calc(${emojiButtonPosition.top}px - ${emojiPickerRef.current.clientHeight}px - 50%)` : 'auto',
                                    transform: 'translateY(-300px)',
                                }}
                            >
                                <EmojiPicker set='emojione' style={{ width: '300px', height: '300px' }} onEmojiClick={handleEmojiSelect} />
                            </div>
                        )}

                        <input
                            id="chatInput"
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            ref={inputRef}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && newMessage.trim() !== '') {
                                    handleSendMessage();
                                }
                            }}
                            style={{
                                flex: '1',
                                borderRadius: '0',
                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                                backgroundColor: colors.backgroundColor,
                                color: colors.textColor,
                                padding: '10px 10px',
                                outline: 'none',
                                borderRight: 'none',
                                borderLeft: 'none'
                            }}
                            autoComplete="off"
                        />

                        <IconButton
                            onClick={() => {
                                const trimmedMessage = newMessage.trim();
                                if (trimmedMessage !== '') {
                                    handleSendMessage();
                                }
                            }}
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
                )
            }
        </div >
    );
};

export default ChatWindow;