// Merger.jsx
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import QuiltedImageList from './Gallery';  // Replace with the correct path
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import './Merger.css';  // Import your CSS file for custom styles
import SenderComponent from './SenderComponent';
import ReceiverComponent from './ReceiverComponent';

function Merger() {
    const [openImagesModal, setOpenImagesModal] = useState(false);
    const [openFriendRequestsModal, setOpenFriendRequestsModal] = useState(false);

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const handleViewAllImages = () => {
        setOpenImagesModal(true);
    };

    const handleViewAllFriendRequests = () => {
        setOpenFriendRequestsModal(true);
    };

    const handleCloseImagesModal = () => {
        setOpenImagesModal(false);
    };

    const handleCloseFriendRequestsModal = () => {
        setOpenFriendRequestsModal(false);
    };

    return (
        <div>
            {/* View All Friend Requests and View All Images */}
            <div className="view-all-buttons">
                <button onClick={handleViewAllFriendRequests}>View All Friend Requests</button>
                <button onClick={handleViewAllImages}>View All Images</button>
            </div>

            {/* Grid container for larger screens */}
            {isLargeScreen && (
                <div className="grid-container">
                    {/* QuiltedImageList takes up 50% of the screen width */}
                    <Grid item xs={12} sm={6} className='mx-auto justify-content-center d-flex'>
                        <QuiltedImageList />
                    </Grid>

                    {/* FriendRequest takes up the other 50% of the screen width */}
                    <Grid item xs={12} sm={6} className='mx-auto justify-content-center d-flex'>
                        <SenderComponent />
                        <ReceiverComponent />
                    </Grid>
                </div>
            )}

            {/* Modal for View All Images */}
            <Dialog open={openImagesModal} onClose={handleCloseImagesModal}>
                <DialogTitle>View All Images</DialogTitle>
                <QuiltedImageList />
            </Dialog>

            {/* Modal for View All Friend Requests */}
            <Dialog open={openFriendRequestsModal} onClose={handleCloseFriendRequestsModal}>
                <DialogTitle>View All Friend Requests</DialogTitle>
                <SenderComponent />
                <ReceiverComponent />
            </Dialog>
        </div>
    );
}

export default Merger;
