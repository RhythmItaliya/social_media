import React, { useState } from 'react';
import Profilebar from "../navbar/ProfileBar";
import Post from '../Post/Post';
import FriendPost from '../Post/FriendPost';
import StoryList from '../Story/StoryList';
import './mix.css';
import { useDarkMode } from '../theme/Darkmode';
import { Tabs, Tab, Drawer, IconButton } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';


import UserChatList from '../Chat/UserChatList';
import DrawerWindow from '../Chat/DrawerWindow';
import SuggestedFriendMain from './SuggestedFriendMain';


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
// border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` 

const Homemix = () => {
    // Dark mode
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [value2, setValue2] = useState(0);
    const [isStoryVisible, setIsStoryVisible] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleChange2 = (event, newValue2) => {
        setValue2(newValue2);
    };

    const toggleStoryVisibility = () => {
        setIsStoryVisible(!isStoryVisible);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const toggleCloseDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };


    const [selectedUser, setSelectedUser] = useState(null);
    const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setIsChatWindowOpen(true);
    };

    return (
        <>
            <div className="overflow-hidden" style={{ height: '100vh' }}>

                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                    className="custom-drawer"
                >
                    <IconButton onClick={toggleCloseDrawer} style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: '1000', backgroundColor: colors.backgroundColor, color: colors.iconColor }}>
                        <ArrowForwardIosOutlinedIcon />
                    </IconButton>
                    <div style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }}>
                        <UserChatList onSelectUser={handleUserSelect} />
                        {isChatWindowOpen && selectedUser && (
                            <DrawerWindow selectedUser={selectedUser} />
                        )}
                    </div>
                </Drawer>

                {/* Render Profilebar only once */}
                <Profilebar toggleStoryVisibility={toggleStoryVisibility} />

                {/*  Story */}
                {isStoryVisible && (
                    <div className={`story-container w-50 mx-auto visible smooth-visible-transition smooth-width-transition`}>
                        <StoryList colors={colors} />
                    </div>
                )}


                <div className="container">
                    <div className="row">
                        {/* Suggested Friend */}
                        <div className="col-lg-3 notificationMain">
                            <div className=''>
                                <>
                                    {/* <SuggestedFriendMain /> */}
                                </>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-6">
                            <div className="justify-content-center align-content-between d-flex">
                                <div>
                                    {/* Messages */}
                                    <IconButton className='messagesMiniWindow' onClick={toggleDrawer(true)} style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: '1000', color: colors.iconColor }}>
                                        <ArrowBackIosNewOutlinedIcon />
                                    </IconButton>

                                    {/* Main Post */}
                                    <div className="justify-content-center align-content-center d-flex">
                                        <Tabs
                                            value={value2}
                                            onChange={handleChange2}
                                        >
                                            <Tab
                                                label="Show Friend Post"
                                                style={{
                                                    fontSize: '12px',
                                                }}
                                            />
                                            <Tab
                                                label="Show Your Post"
                                                style={{
                                                    fontSize: '12px',
                                                }}
                                            />
                                        </Tabs>
                                    </div>
                                    <div className="tab-content">
                                        {value2 === 0 && <FriendPost />}
                                        {value2 === 1 && <Post />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Another Div */}
                        <div className="col-lg-3 suggestedFriendMain">
                            <div className='d-flex justify-content-center align-content-center'>
                                <SuggestedFriendMain colors={colors} />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
};

export default Homemix;
