// registerAuth.js

import { message } from 'antd';
import { registerRequest, registerSuccess, registerFailure, setGlobalLoading } from './authActions';

export const registerUser = (userData) => async (dispatch) => {
    dispatch(registerRequest());
    dispatch(setGlobalLoading(true));

    try {
        const res = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
        });

        if (res.status === 409) {
            dispatch(setGlobalLoading(false));
            message.error("Username or Email is already exist");
        } else if (res.status === 500) {
            dispatch(setGlobalLoading(false));
            message.error("Register Failed");
        } else if (res.ok) {
            message.success("Register Successfully. Please Check Your Email.");
            dispatch(registerSuccess(userData));
            dispatch(setGlobalLoading(false));

            setTimeout(() => {
                window.location.href = './login';
            }, 1500);
        } else {
            message.error('Registration failed. Please try again.');
            dispatch(registerFailure());
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        dispatch(registerFailure());
        dispatch(setGlobalLoading(false));
    }
};
