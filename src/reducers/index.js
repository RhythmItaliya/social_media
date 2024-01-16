// reducers/index.js
import { combineReducers } from 'redux';
import authReducerLogin from '../reducers/loginReducer';
import authReducerRegister from '../reducers/registerReducer';
import authReducerLogout from './logoutReducer';

import userPhotoReducer from './userPhotoReducer';
import useruuidReducer from './useruuidReducer';
import profileuuidReducer from './profileuuidReducer';
import imageReducer from './imageReducer';

const rootReducer = combineReducers({
    login: authReducerLogin,
    register: authReducerRegister,
    logout: authReducerLogout,
    useruuid: useruuidReducer,
    profileuuid: profileuuidReducer,
    userPhoto: userPhotoReducer,
    post: imageReducer,
});

export default rootReducer;
