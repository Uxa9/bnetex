import {AuthState, AuthAction, AuthActionTypes} from '../actions/auth';

const initialState: AuthState = {
    isAuth: false,
    error: null,
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            return { isAuth: true, error: null };
        case AuthActionTypes.LOGIN_ERROR:
            return { isAuth: false, error: action.payload };
        case AuthActionTypes.LOGOUT:
            return { isAuth: false, error: null };
        default:
            return state;
    }
};
