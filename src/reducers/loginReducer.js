
//authReducerLogin.js
import * as types from '../actions/types';

const initialState = {
  loggingIn: false,
  user: null,
  error: null,
  loading: false, // Add loading property
};

const authReducerLogin = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_GLOBAL_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case types.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        error: null,
        loading: true, // Set loading to true when login request is initiated
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.payload,
        error: null,
        loading: false, // Set loading to false when login is successful
      };
    case types.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        user: null,
        error: action.payload,
        loading: false, // Set loading to false when login fails
      };
    default:
      return state;
  }
};

export default authReducerLogin;
