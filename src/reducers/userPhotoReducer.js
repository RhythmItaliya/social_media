// reducers/userPhotoReducer.js
import * as types from '../actions/types';

const initialState = {
    photoUrl: '',
};

const userPhotoReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_USER_PHOTO:
            return {
                ...state,
                photoUrl: action.payload,
            };
        default:
            return state;
    }
};

export default userPhotoReducer;
