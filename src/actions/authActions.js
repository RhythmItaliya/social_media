// Action creators


// authActions.js
import config from '../configuration';
import * as types from './types';

export const setGlobalLoading = (loading) => ({ type: types.SET_GLOBAL_LOADING, payload: loading });

export const registerRequest = () => ({ type: types.REGISTER_REQUEST });
export const registerSuccess = () => ({ type: types.REGISTER_SUCCESS });
export const registerFailure = (error) => ({ type: types.REGISTER_FAILURE, payload: error });


export const loginRequest = () => ({ type: types.LOGIN_REQUEST });
export const loginSuccess = (user) => ({ type: types.LOGIN_SUCCESS, payload: user });
export const loginFailure = (error) => ({ type: types.LOGIN_FAILURE, payload: error });


export const logoutUser = () => ({ type: types.LOGOUT });


export const setUserUuid = (uuid) => ({
    type: types.USER_SET_UUID,
    payload: uuid,
});

export const setProfileUuid = (uuid) => ({
    type: types.PROFILE_SET_UUID,
    payload: uuid,
});

export const setUserPhoto = (photoUrl) => ({
    type: types.SET_USER_PHOTO,
    payload: photoUrl,
});


export const setBase64Data = (base64Data) => {
    return {
        type: types.SET_BASE64_DATA,
        payload: base64Data,
    };
};

export const setUserProfilePosts = (posts) => ({
    type: types.SET_USER_PROFILE_POSTS,
    payload: posts,
});


export const setUsername = (username) => ({
    type: types.SET_USERNAME,
    payload: username,
});

export const removePostBase64 = () => ({
    type: types.REMOVE_POST_BASE64,
});


export const toggleDarkMode = (isDarkMode) => async (dispatch, getState) => {
    try {
        const response = await fetch(`${config.apiUrl}/darkmode/api/user/profiles/${getState().useruuid.uuid}/mode`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ darkMode: isDarkMode }),
        });

        if (response.ok) {
            dispatch({
                type: types.TOGGLE_DARK_MODE,
                payload: isDarkMode,
            });
        } else {
            console.error('Error updating dark mode:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating dark mode:', error);
    }
};