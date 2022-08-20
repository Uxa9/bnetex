
export interface AuthState {
    isAuth: boolean,
    error: null | string
}

export enum AuthActionTypes {
    LOGIN = 'LOGIN',
    LOGIN_ERROR = 'LOGIN_ERROR',
    LOGOUT = 'LOGOUT'
}

interface LoginAuthAction {
    type: AuthActionTypes.LOGIN
}

interface LoginAuthErrorAction {
    type: AuthActionTypes.LOGIN_ERROR
    payload: string
}

interface LogoutAuthAction {
    type: AuthActionTypes.LOGOUT
}

export type AuthAction = LoginAuthAction | LoginAuthErrorAction | LogoutAuthAction
