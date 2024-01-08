// reducers/profileuuidReducer.js
import * as types from '../actions/types';

const initialState = {
    uuid: null,
};

const profileuuidReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.PROFILE_SET_UUID:
            return {
                ...state,
                uuid: action.payload,
            };
        default:
            return state;
    }
};

export default profileuuidReducer;
