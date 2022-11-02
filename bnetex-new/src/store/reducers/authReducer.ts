import {AuthState, AuthAction, AuthActionTypes} from '../actions/auth';

const initialState: AuthState = {
    isAuth: false,
    loading: true,
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            return { isAuth: true, loading: false };
        case AuthActionTypes.LOGOUT:
            return { isAuth: false, loading: false };
        default:
            return state;
    }
};
