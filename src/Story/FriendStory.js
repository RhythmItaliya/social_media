// FriendStory.js
import React from 'react';
import { Modal, Backdrop, Fade, IconButton, Avatar } from '@mui/material';
import { Close } from '@mui/icons-material';

const FriendStory = ({ open, onClose, selectedUser, colors }) => {
    return (
        <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                {/* Center modal content horizontally */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <div style={{ position: 'relative' }}>
                        {/* Image overlay */}
                        {selectedUser && (
                            <Avatar
                                src={selectedUser.image}
                                alt={selectedUser.name}
                                style={{ width: '350px', height: '550px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        )}
                        {/* Close icon outside text overlay */}
                        <IconButton style={{ position: 'absolute', top: 0, right: 0, color: colors.iconColor }} onClick={onClose}>
                            <Close />
                        </IconButton>
                        {/* Text overlay */}
                        <div style={{ position: 'absolute', bottom: '0', textAlign: 'center', width: '100%', color: colors.textColor }}>
                            {selectedUser && (
                                <div>
                                    <p className='mt-2' style={{ color: colors.textColor }}>{selectedUser.storyText}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
};

export default FriendStory;
