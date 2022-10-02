import {AuthState, AuthAction, AuthActionTypes} from '../actions/auth';

const initialState: AuthState = {
    isAuth: false,
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            return { isAuth: true };
        case AuthActionTypes.LOGOUT:
            return { isAuth: false };
        default:
            return state;
    }
};
