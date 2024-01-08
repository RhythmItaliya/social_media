// reducers/useruuidReducer.js
import * as types from '../actions/types';

const initialState = {
    uuid: null,
};

const useruuidReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.USER_SET_UUID:
            return {
                ...state,
                uuid: action.payload,
            };
        default:
            return state;
    }
};

export default useruuidReducer;
