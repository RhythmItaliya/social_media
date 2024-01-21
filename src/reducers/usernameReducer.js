// usernameReducer.js

import * as types from '../actions/types';

const initialState = {
    username: null,
};

const usernameReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_USERNAME:
            return {
                ...state,
                username: action.payload,
            };
        default:
            return state;
    }
};

export default usernameReducer;
