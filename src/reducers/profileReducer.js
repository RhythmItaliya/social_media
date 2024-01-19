// profileReducer.js

import * as types from '../actions/types';

const initialState = {
    userProfilePosts: [],
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_USER_PROFILE_POSTS:
            return {
                ...state,
                userProfilePosts: action.payload,
            };
        default:
            return state;
    }
};

export default profileReducer;
