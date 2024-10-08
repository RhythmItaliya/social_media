import { message } from "antd";
import { loginRequest, loginSuccess, loginFailure, setGlobalLoading } from "./authActions";
import CryptoJS from 'crypto-js';
import config from "../configuration";

export const loginUser = (userData) => (dispatch) => {
    dispatch(loginRequest());
    dispatch(setGlobalLoading(true));

    fetch(`${config.apiUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            if (response.status === 401) {
                message.error('Username and Password are incorrect.');
                return;
            } else if (response.status === 403) {
                message.error('User is terminated.');
                return;
            } else if (!response.ok) {
                message.error('Login failed due to a server error.');
                return;
            } else {
                return response.json();
            }
        })
        .then((data) => {
            if (data && data['X-Access-Token'] && data['uuid'] && data['username']) {
                const token = data['X-Access-Token'];
                const uuid = data['uuid'];
                const username = data['username'];

                const encryptedUuid = CryptoJS.AES.encrypt(uuid, 'ASDCFVBNLKMNBSDFVBNJNBCV').toString();

                document.cookie = `auth=${token}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;

                document.cookie = `username=${username}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;

                document.cookie = `token=${encryptedUuid}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;

                fetch(`${config.apiUrl}/create/api/users/profileCreated/${uuid}`, {
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
