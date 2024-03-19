// LogoutButton.js
import React from 'react';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logoutUser } from '../actions/logoutActions';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StyledIconButton from '@material-ui/core/IconButton';
import './others.css';
import { useDarkMode } from '../theme/Darkmode';
import { persistStore } from 'redux-persist';
import { store } from '../store/store';
import config from '../configuration';

const LogoutButton = ({ logoutUser }) => {
    const { isDarkMode } = useDarkMode();
    const [, , removeCookies] = useCookies(['auth', 'username', 'token']);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            console.log('X-Access-Token removed', data);

            if (response.ok) {

                // Clear Redux persistor
                const persistor = persistStore(store);
                persistor.purge();

                // Clear localStorage
                localStorage.clear();

                // Remove cookies
                removeCookies('auth', { path: '/' });
                removeCookies('username', { path: '/' });
                removeCookies('token', { path: '/' });

                // Dispatch logout action
                logoutUser();

                console.log('Logout successful');
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
