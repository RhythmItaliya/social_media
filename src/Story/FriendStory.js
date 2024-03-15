import React, { useState, useEffect } from 'react';
import { Modal, Backdrop, Fade, IconButton, Avatar } from '@mui/material';
import { Close, ArrowBack, ArrowForward } from '@mui/icons-material';

const FriendStory = ({ open, onClose, selectedUser, colors }) => {
    const [storyDetails, setStoryDetails] = useState(null);
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchStoryDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/get/friend/stories/${selectedUser.uuid}`, {
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
                    <div style={{ position: 'relative' }}>
                        {storyDetails && (
                            <>
                                <Avatar
                                    src={`http://static.stories.local/${storyDetails.image}` || 'https://via.placeholder.com/200'}
                                    alt="Story Preview"
                                    style={{ width: '350px', height: '550px', objectFit: 'cover', borderRadius: '8px' }}
                                />


                                <div style={{ position: 'absolute', top: '0', textAlign: 'center', width: '100%', color: storyDetails.textColor }}>
                                    <div className='d-flex justify-content-center align-content-center gap-2 mt-2'>
                                        <Avatar
                                            src={selectedUser.photoURL || 'https://via.placeholder.com/200'}
                                            alt={selectedUser.username}
                                            style={{ width: '30px', height: '30px' }}
                                        />
                                        <p className='mt-1' style={{ color: colors.textColor, fontSize: '14px' }}>@{selectedUser.username}</p>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', bottom: '0', textAlign: 'center', width: '100%', color: storyDetails.textColor }}>
                                    {storyDetails.text && <p className='mt-2' style={{ color: storyDetails.textColor }}>{storyDetails.text}</p>}
                                </div>

                                <IconButton style={{ position: 'absolute', top: 0, right: 0, color: 'white' }} onClick={handleCloseStoryModal}>
                                    <Close style={{ color: colors.textColor }} />
                                </IconButton>

                                <IconButton style={{ position: 'absolute', top: '45%', left: 0 }} onClick={handlePreviousStory}>
                                    <ArrowBack style={{ color: colors.textColor }} />
                                </IconButton>

                                <IconButton style={{ position: 'absolute', top: '45%', right: 0 }} onClick={handleNextStory}>
                                    <ArrowForward style={{ color: colors.textColor }} />
                                </IconButton>
                            </>
                        )}
                    </div>
                </div>
            </Fade>
        </Modal>
    );
};

export default FriendStory;
