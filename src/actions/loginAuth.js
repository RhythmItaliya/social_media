// Import necessary libraries and actions
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
                dispatch(setGlobalLoading(false));
            } else if (!response.ok) {
                message.error('Login failed due to a server error.');
                dispatch(setGlobalLoading(false));
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

                // Redirect to home
                window.location.href = '/home';

                message.success('Successfully Logged In');
                dispatch(setGlobalLoading(false));
                dispatch(loginSuccess(false));
            }
        })
        .catch((error) => {
            // Handle errors
            console.error(error);
            dispatch(loginFailure());
        })
        .finally(() => {
            // Cleanup or additional actions if needed
        });
};
