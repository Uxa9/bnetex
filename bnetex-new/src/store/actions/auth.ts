
export interface AuthState {
    isAuth: boolean,
}

export enum AuthActionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

interface LoginAuthAction {
    type: AuthActionTypes.LOGIN
}

interface LogoutAuthAction {
    type: AuthActionTypes.LOGOUT
}

export type AuthAction = LoginAuthAction | LogoutAuthAction
