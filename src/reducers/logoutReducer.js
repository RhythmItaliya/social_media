import * as types from '../actions/types';

const initialState = {
  loggingOut: false,
  error: null,
};

const logoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGOUT:
      return {
        ...state,
        loggingOut: true,
        error: null,
      };
    default:
      return state;
  }
};

export default logoutReducer;
