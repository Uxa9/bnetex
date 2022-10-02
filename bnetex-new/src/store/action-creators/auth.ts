import { Dispatch } from 'redux';
import { AuthAction, AuthActionTypes } from '../actions/auth';

export const loginUser = () => {
    return async (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.LOGIN});
    };
};

export const logoutUser = () => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.LOGOUT });
        localStorage.removeItem('userInfo-BNETEX');
    };
};
