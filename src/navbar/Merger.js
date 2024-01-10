// Merger.jsx
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import QuiltedImageList from './Gallery';  // Replace with the correct path
import { Grid, useMediaQuery, useTheme } from '@mui/material';
import './Merger.css';  // Import your CSS file for custom styles
import SenderComponent from './SenderComponent';
import ReceiverComponent from './ReceiverComponent';
import { useDarkMode } from '../theme/Darkmode';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff',
};

function Merger() {
    const [openImagesModal, setOpenImagesModal] = useState(false);
    const [openFriendRequestsModal, setOpenFriendRequestsModal] = useState(false);

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

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

            {isLargeScreen && (
                <div className="grid-container">
                    {/* QuiltedImageList takes up 50% of the screen width */}
                    <Grid item xs={12} lg={6} className='mx-auto justify-content-center bg-info d-flex'>
                        <QuiltedImageList />
                    </Grid>

                    {/* SenderComponent takes up 25% of the screen width */}
                    <Grid item xs={12} lg={3} className='mx-auto justify-content-center d-flex'>
                        <div
                            style={{
                                border: `1px solid ${isDarkMode ? darkModeColors.border : lightModeColors.border}`,
                            }}
                        >
                            <ReceiverComponent />
                        </div>
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
        </div >
    );
}

export default Merger;
