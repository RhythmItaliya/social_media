
// authReducerRegister.js
import * as types from '../actions/types';

const initialState = {
    registering: false,
    loading: false, // Add loading property
    error: null,
};

const authReducerRegister = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_GLOBAL_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case types.REGISTER_REQUEST:
            return {
                ...state,
                registering: true,
                error: null,
                loading: true, // Set loading to true when registration request is initiated
            };
        case types.REGISTER_SUCCESS:
            return {
                ...state,
                registering: false,
                loading: false, // Set loading to false when registration is successful
            };
        case types.REGISTER_FAILURE:
            return {
                ...state,
                registering: false,
                error: action.payload,
                loading: false, // Set loading to false when registration fails
            };
        default:
            return state;
    }
};

export default authReducerRegister;
