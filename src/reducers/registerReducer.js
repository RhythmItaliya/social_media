// authReducerRegister.js
import * as types from '../actions/types';

const initialState = {
    registering: false,
    loading: false,
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
                loading: true, 
            };
        case types.REGISTER_SUCCESS:
            return {
                ...state,
                registering: false,
                loading: false,
            };
        case types.REGISTER_FAILURE:
            return {
                ...state,
                registering: false,
                error: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export default authReducerRegister;
