import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { KeyboardDoubleArrowDown, Notifications, PersonAdd } from '@mui/icons-material';
import { useDarkMode } from '../theme/Darkmode';
import Logout from '../others/Logout';
import Layout from '../theme/Layout';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import MarkasRead from './MarkasRead';
import './Merger.css';


import {
    IconButton,
    Typography,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';


import { CloseOutlined } from '@material-ui/icons';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const CenteredIcons = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    color: theme.isDarkMode ? darkModeColors.iconColor : lightModeColors.iconColor,
}));

const UserInfo = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
    color: theme.isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    '&:focus': {
        color: theme.isDarkMode ? darkModeColors.focusColor : lightModeColors.focusColor,
    },
    '&.MuiIconButton-root': {
        color: theme.isDarkMode ? darkModeColors.iconColor : lightModeColors.iconColor,
    },
}));

export default function Profilebar({ toggleStoryVisibility }) {
    const { isDarkMode } = useDarkMode();

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    const [isAvtar, setAvtar] = React.useState(null);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };


    // userPhotoUrl
    const userPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);

    //username
    const loginUserUsername = useSelector((state) => state.name.username);

    const user = {
        avatar: userPhotoUrl,
        username: loginUserUsername,
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{
                backgroundColor: colors.backgroundColor,
                borderBottom: `1px solid ${isDarkMode ? darkModeColors.border : lightModeColors.border}`,
                boxShadow: isDarkMode ? darkModeColors.boxShadow : lightModeColors.boxShadow,
            }}>
                <Toolbar>
                    <CenteredIcons>
                        {/* Notification icon */}
                        <Tooltip title="Notifications">
                            <StyledIconButton color="inherit" style={{ color: colors.iconColor }}>
                                <Notifications />
                            </StyledIconButton>
                        </Tooltip>

                        {/* Friend request icon */}
                        <Tooltip title="Friend Requests">
                            <StyledIconButton color="inherit" style={{ color: colors.iconColor }} onClick={handleClick}>
                                <PersonAdd />
                            </StyledIconButton>
                        </Tooltip>

                        {/* Story */}
                        <Tooltip title="See Story">
                            <StyledIconButton color="inherit" style={{ color: colors.iconColor }}>
                                <KeyboardDoubleArrowDown onClick={toggleStoryVisibility} style={{ cursor: 'pointer' }} />
                            </StyledIconButton>
                        </Tooltip>
                    </CenteredIcons>


                    <div ref={dropdownRef} className={`smooth-div ${isOpen ? 'open' : ''}`}>
                        <MarkasRead colors={colors} />
                    </div>

                    {/* User information */}
                    <UserInfo>
                        <Logout />
                        <Layout />

                        <Typography variant="subtitle1" sx={{ color: '#ec1b90', textDecoration: 'underline' }}>
                            {user.username}
                        </Typography>

                        {user.avatar ? (
                            <Avatar
                                src={user.avatar}
                                alt={`${user.username}`}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer'

                                }}
                                onClick={() => {
                                    setIsAvatarModalOpen(true);
                                    setAvtar(true);
                                }} />
                        ) : (
                            <Avatar
                                alt={`${user.username}`}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setIsAvatarModalOpen(true);
                                    setAvtar(true);
                                }} />
                        )}
                    </UserInfo>


                    {/* Avatar Modal */}
                    <Dialog open={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} style={{
                        cursor: 'pointer'
                    }}>

                        <DialogTitle style={{
                            // color: colors.textColor,
                            color: '#ec1b90',
                            backgroundColor: colors.backgroundColor,
                            textAlign: 'center',
                            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                            borderBottom: 'none',
                            boxShadow: colors.boxShadow,
                            fontSize: '16px'
                        }}>
                            {`@${user.username || ''}`}
                        </DialogTitle>

                        <DialogContent
                            style={{
                                backgroundColor: colors.backgroundColor,
                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                                borderBottom: 'none',
                                padding: '20px',
                                boxShadow: colors.boxShadow,
                            }}>
                            {isAvtar && (
                                userPhotoUrl ? (
                                    <Avatar
                                        src={userPhotoUrl}
                                        alt={`${user.username || ''}`}
                                        style={{ width: '200px', height: '200px', cursor: 'pointer' }}
                                        onClick={() => {
                                            setIsAvatarModalOpen(true);
                                            setAvtar(true);
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        style={{ width: '200px', height: '200px', cursor: 'pointer' }}
                                        onClick={() => {
                                            setIsAvatarModalOpen(true);
                                            setAvtar(true);
                                        }}
                                    />
                                )
                            )}
                        </DialogContent>

                        <DialogActions
                            style={{
                                backgroundColor: colors.backgroundColor,
                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5`,
                                boxShadow: colors.boxShadow,
                            }}>
                            <IconButton
                                style={{
                                    color: colors.iconColor
                                }} onClick={() => setIsAvatarModalOpen(false)}>
                                <CloseOutlined />
                            </IconButton>
                        </DialogActions>
                    </Dialog>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
