// Action creators


// authActions.js
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
