import { message } from "antd";
import { loginRequest, loginSuccess, loginFailure, setGlobalLoading } from "./authActions";
import CryptoJS from 'crypto-js';

export const loginUser = (userData) => (dispatch) => {
    dispatch(loginRequest());
    dispatch(setGlobalLoading(true));

    fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            if (response.status === 401) {
                message.error('Username and Password are incorrect...');
            } else if (!response.ok) {
                message.error('Login failed due to a server error.');
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data && data['X-Access-Token'] && data['uuid'] && data['username']) {
                const token = data['X-Access-Token'];
                const uuid = data['uuid'];
                const username = data['username'];

                // Encrypting uuid
                const encryptedUuid = CryptoJS.AES.encrypt(uuid, 'ASDCFVBNLKMNBSDFVBNJNBCV').toString();

                // Set the cookie with the authentication token
                document.cookie = `auth=${token}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;

                // Set the cookie with the username
                document.cookie = `username=${username}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;

                // Set the cookie with the encryptedUuid
                document.cookie = `token=${encryptedUuid}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;

                // Execute additional API call after successful login
                fetch(`http://localhost:8080/api/users/profileCreated/${uuid}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status === 404) {
                            return { error: 'User not found' };
                        } else if (response.status === 500) {
                            return { error: 'Internal Server Error' };
                        } else {
                            throw new Error('Unexpected error');
                        }
                    })
                    .then((profileData) => {
                        dispatch(setGlobalLoading(false));
                        if (profileData && profileData.profileCreated === false) {
                            window.location.href = '/profile/create';
                        } else {
                            window.location.href = '/home';
                        }
                    })
                    .catch((error) => {
                        console.error('Error in additional API call:', error);
                        dispatch(setGlobalLoading(false));
                    });

                message.success('Successfully Logged In');
                dispatch(loginSuccess(false));
            }
        })
        .catch((error) => {
            console.error('Error during login:', error);
            message.error('Unexpected error during login.');
        })
        .finally(() => {
            dispatch(setGlobalLoading(false));
        });
};
