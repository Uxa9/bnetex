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
            return { ...state, isAuth: false };
        case AuthActionTypes.SEND_AUTH_REQUEST: 
            return { ...state, loading: true };
        case AuthActionTypes.AUTH_REQUEST_RETURNED: {
            return { ...state, loading: false};
        }
        default:
            return state;
    }
};
