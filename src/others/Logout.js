// LogoutButton.js
import React from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logoutUser } from '../actions/logoutActions';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StyledIconButton from '@material-ui/core/IconButton';
import './others.css';
import { useDarkMode } from '../theme/Darkmode'; // Replace with the actual path

const LogoutButton = ({ logoutUser }) => {
    const { isDarkMode } = useDarkMode(); // Use the hook to get the current mode
    const [, , removeCookies] = useCookies(['auth', 'username', 'token']);

    const handleLogout = () => {
        // Remove cookies
        removeCookies('auth');
        removeCookies('username');
        removeCookies('token');

        // Dispatch logout action
        logoutUser();
    };

    return (
        <StyledIconButton
            color="inherit"
            onClick={handleLogout}
            className="logout-button"
            style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} // Set color based on the current mode
        >
            <ExitToAppIcon />
        </StyledIconButton>
    );
};

export default connect(null, { logoutUser })(LogoutButton);
