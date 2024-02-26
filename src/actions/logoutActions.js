// authActions.js
import * as types from './types';

export const logoutUser = () => (dispatch) => {
  dispatch({ type: types.LOGOUT });

  window.location.href = '/login';
};
