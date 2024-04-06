import React, { useState, useEffect } from 'react';
import { Modal, Backdrop, Fade, IconButton, Avatar, CardMedia } from '@mui/material';
import { Close, ArrowBack, ArrowForward } from '@mui/icons-material';
import config from '../configuration';
import { useNavigate } from 'react-router-dom';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const FriendStory = ({ open, onClose, selectedUser, colors }) => {
    const [storyDetails, setStoryDetails] = useState(null);
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${selectedUser.username}`);
    };

    useEffect(() => {
        const fetchStoryDetails = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/stories/get/friend/stories/${selectedUser.uuid}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setStories(responseData.stories);
                    setStoryDetails(responseData.stories[0]);
                } else {
                    console.error('Failed to fetch story details');
                }
            } catch (error) {
                console.error('Error fetching story details:', error);
            }
        };

        if (selectedUser && selectedUser.uuid) {
            fetchStoryDetails();
        }
    }, [selectedUser]);

    const handleCloseStoryModal = () => {
        onClose();
        setStoryDetails(null);
    };

    const handleNextStory = () => {
        if (stories && stories.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
            setStoryDetails(stories[(currentIndex + 1) % stories.length]);
        }
    };

    const handlePreviousStory = () => {
        if (stories && stories.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
            setStoryDetails(stories[(currentIndex - 1 + stories.length) % stories.length]);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                handlePreviousStory();
            } else if (event.key === 'ArrowRight') {
                handleNextStory();
            }
        };

        const handleTouchStart = (event) => {
            const touchStartX = event.touches[0].clientX;

            const handleTouchEnd = (event) => {
                const touchEndX = event.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;

                if (deltaX > 50) {
                    handlePreviousStory();
                } else if (deltaX < -50) {
                    handleNextStory();
                }
                document.removeEventListener('touchend', handleTouchEnd);
            };
            document.addEventListener('touchend', handleTouchEnd);
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('touchstart', handleTouchStart);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('touchstart', handleTouchStart);
        };
    }, [handleNextStory, handlePreviousStory]);


    return (
        <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={open}
            onClose={handleCloseStoryModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            style={{
                backgroundColor: colors.transparentColor
            }}
        >
            <Fade in={open}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '550px',
                    width: '350px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '8px',
                }}>
                    <div>
                        {storyDetails && (
                            <>
                                <div className='d-flex justify-content-around align-items-center p-1' style={{ zIndex: 9999, backgroundColor: colors.backgroundColor, borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`, borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                                    {stories && (
                                        <div>
                                            <span style={{ color: colors.textColor }}>{currentIndex + 1}/{stories.length}</span>
                                        </div>
                                    )}

                                    <div className='d-flex justify-content-center align-items-center gap-2' style={{ cursor: 'pointer' }} onClick={handleClick}>
                                        {selectedUser.photoURL ? (
                                            <div>
                                                <Avatar
                                                    src={selectedUser.photoURL}
                                                    alt={selectedUser.username}
                                                    style={{ width: '32px', height: '32px' }}
                                                />
                                            </div>
                                        ) : (
                                            <Avatar
                                                alt={selectedUser.username}
                                                style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                                            />
                                        )}
                                        <p style={{ color: colors.textColor, fontSize: '14px', margin: 0 }}>@{selectedUser.username}</p>
                                    </div>

                                    <div>
                                        <IconButton style={{ color: '#ec1b90' }} onClick={handleCloseStoryModal}>
                                            <Close />
                                        </IconButton>
                                    </div>
                                </div>

                                <div style={{ width: '350px', overflow: 'hidden', backgroundColor: colors.backgroundColor, borderBottomLeftRadius: storyDetails.text ? '0px' : '10px', borderBottomRightRadius: storyDetails.text ? '0px' : '10px', }} onClick={handleNextStory}>
                                    <CardMedia
                                        image={`http://static.stories.local/${storyDetails.image}`}
                                        alt="Story Preview"
                                        component="img"
                                        height="550"
                                        loading='lazy'
                                        sx={{
                                            background: '#fffff',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>

                                <div className='d-flex align-items-center justify-content-center' style={{ display: storyDetails.text ? 'flex' : 'none', color: storyDetails.textColor, backgroundColor: colors.backgroundColor }}>
                                    {storyDetails.text && <p style={{ color: storyDetails.textColor, margin: '10px' }}>{storyDetails.text}</p>}
                                </div>

                                <div className='d-flex align-item-center justify-content-around p-1' style={{ backgroundColor: colors.backgroundColor, borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
                                    <IconButton style={{ color: '#ec1b90' }} onClick={handlePreviousStory}>
                                        <ArrowBack />
                                    </IconButton>

                                    <IconButton style={{ color: '#ec1b90' }} onClick={handleNextStory}>
                                        <ArrowForward />
                                    </IconButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Fade>
        </Modal >
    );
};

export default FriendStory;
