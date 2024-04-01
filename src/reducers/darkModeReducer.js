// darkModeReducer.js

import * as types from '../actions/types';

const initialState = {
  isDarkMode: false,
};

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload,
      };
    default:
      return state;
  }
};

export default darkModeReducer;
