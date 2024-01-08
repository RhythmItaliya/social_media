
// registerAuth.js

import { message } from 'antd';
import { registerRequest, registerSuccess, registerFailure, setGlobalLoading } from './authActions';

export const registerUser = (userData) => async (dispatch) => {
    dispatch(registerRequest());

    dispatch(setGlobalLoading(true));

    await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
    })
        .then((res) => {
            if (res.status === 409) {

                setTimeout(() => {
                    dispatch(setGlobalLoading(false));
                    message.error("Username or Email is already exist");
                }, 1500);

            } else if (res.status === 500) {

                setTimeout(() => {
                    dispatch(setGlobalLoading(false));
                    message.error("Register Failed");
                }, 1500);

            } else if (res.ok) {

                setTimeout(() => {
                    message.success("Register Successfully. Please Check Your Email.");
                    window.location.href = './login';
                    dispatch(registerSuccess(userData));
                    dispatch(setGlobalLoading(false));
                }, 1500);

            } else {
                message.error('Registration failed. Please try again.');
                dispatch(registerFailure());
            }
        })

        .catch((error) => {
            // message.error('An error occurred during login.');
            dispatch(registerFailure());
            // console.log(error)
            dispatch(setGlobalLoading(false));
        })
};
