// imageReducer.js
import * as types from '../actions/types';

const initialState = {
    base64Data: null,
};

const imageReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_BASE64_DATA:
            return {
                ...state,
                base64Data: action.payload,
            };
        case types.REMOVE_POST_BASE64:
            return {
                ...state,
                base64Data: null,
            };
        default:
            return state;
    }
};

export default imageReducer;
