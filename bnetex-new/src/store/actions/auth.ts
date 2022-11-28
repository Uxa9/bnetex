
export interface AuthState {
    isAuth: boolean,
    loading: boolean,
}

export enum AuthActionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SEND_AUTH_REQUEST = 'SEND_AUTH_REQUEST',
    AUTH_REQUEST_RETURNED = 'AUTH_REQUEST_RETURNED',
}

interface SendAuthRequestAction {
    type: AuthActionTypes.SEND_AUTH_REQUEST;
}

interface LoginAuthAction {
    type: AuthActionTypes.LOGIN;
}

interface LogoutAuthAction {
    type: AuthActionTypes.LOGOUT;
}

interface AuthRequestReturnedAction {
    type: AuthActionTypes.AUTH_REQUEST_RETURNED;
}

export type AuthAction = LoginAuthAction | LogoutAuthAction | AuthRequestReturnedAction 
    | SendAuthRequestAction;
