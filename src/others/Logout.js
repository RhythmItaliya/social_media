// LogoutButton.js
import React from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logoutUser } from '../actions/logoutActions';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StyledIconButton from '@material-ui/core/IconButton';
import './others.css';
import { useDarkMode } from '../theme/Darkmode';

const LogoutButton = ({ logoutUser }) => {
    const { isDarkMode } = useDarkMode();
    const [, , removeCookies] = useCookies(['auth', 'username', 'token']);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
              
                removeCookies('auth');
                removeCookies('username');
                removeCookies('token');
                
                logoutUser();
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <StyledIconButton
            color="inherit"
            onClick={handleLogout}
            className="logout-button"
            style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
        >
            <ExitToAppIcon />
        </StyledIconButton>
    );
};

export default connect(null, { logoutUser })(LogoutButton);
