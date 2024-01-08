// authActions.js
import * as types from './types';

export const logoutUser = () => (dispatch) => {
  // Clear authentication state
  dispatch({ type: types.LOGOUT });

  window.location.href = '/login';
};
