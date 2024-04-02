import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import HashUsePost from '../HashUsePost';

import '../../mixComponet/mix.css';
import { Drawer, IconButton } from '@mui/material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

import UserChatList from '../../Chat/UserChatList';
import DrawerWindow from '../../Chat/DrawerWindow';
import SuggestedFriendMain from '../../mixComponet/SuggestedFriendMain';

const HashName = ({ colors }) => {
    const { hashtag } = useParams();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

        <div className="overflow-hidden" style={{ height: '90vh' }}>
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

            <div className="container">
                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        <div className="justify-content-center align-content-between d-flex">
                            <div>
                                {/* Messages */}
                                <IconButton className='messagesMiniWindow' onClick={toggleDrawer(true)} style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: '1000', color: colors.iconColor }}>
                                    <ArrowBackIosNewOutlinedIcon />
                                </IconButton>

                                {/* Main Hash Post */}
                                <div className="justify-content-center align-content-center d-flex">
                                    <div className="tab-content">
                                        <HashUsePost hashtag={hashtag} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SuggestedFriend Div */}
                    <div className="col-lg-4 suggestedFriendMain">
                        <div className='d-flex justify-content-center align-content-center'>
                            <SuggestedFriendMain colors={colors} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default HashName;
