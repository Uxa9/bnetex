import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { Dispatch } from 'redux';
import { AuthAction, AuthActionTypes } from '../actions/auth';

const { api } = useApi();

interface LoginResponse {
    message: string;
    status: string;
    token: string;
    userId: number;
}

export const loginUser = (email: string, password: string) => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.SEND_AUTH_REQUEST});

        return api
            .post<LoginResponse>('/auth/login', {
                email: email,
                password: password,
            }) 
            .then((res) => {
                const userInfo = {
                    token: res.data.token,
                    userId: res.data.userId,
                    email: email,
                };
                localStorage.setItem('userInfo-BNETEX', JSON.stringify(userInfo));
                dispatch({ type: AuthActionTypes.LOGIN});
            })
            .catch((err) => {
                dispatch({ type: AuthActionTypes.AUTH_REQUEST_RETURNED});
                throw new Error(err.response.data.message);
            });
    };
};

export const logoutUser = () => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.LOGOUT });
        localStorage.removeItem('userInfo-BNETEX');
    };
};

export const signup = (email: string, password: string) => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.SEND_AUTH_REQUEST});

        return api
            .post('/auth/registration', {
                email: email,
                password: password,
            }) 
            .then(() => {
                const userInfo = {
                    token: null,
                    userId: null,
                    email: email,
                };
                localStorage.setItem('userInfo-BNETEX', JSON.stringify(userInfo));
                dispatch({ type: AuthActionTypes.AUTH_REQUEST_RETURNED});
            })
            .catch((err) => {
                dispatch({ type: AuthActionTypes.AUTH_REQUEST_RETURNED});
                throw new Error(err.response.data.message);
            });
    };
};

export const confirmEmail = (email: string, activationCode: string) => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.SEND_AUTH_REQUEST});

        return  api.post<LoginResponse>(
            '/auth/confirm-email', {
                email: email,
                activationCode: activationCode,
            })
            .then((res) => {
                const userInfo = {
                    token: res.data.token,
                    userId: res.data.userId,
                    email: email,
                };
                localStorage.setItem('userInfo-BNETEX', JSON.stringify(userInfo));
                dispatch({ type: AuthActionTypes.LOGIN});
                
                // Костыль. Нужно добавить юзеру поле justRegistered. При успешной активации почты ставить
                // его в true. Затем, при открытии страницы RegistrationFinalize отправлять запрос на 
                // установку поля в true
                localStorage.setItem('justRegistered', 'true');
            })
            .catch((err) => {
                dispatch({ type: AuthActionTypes.AUTH_REQUEST_RETURNED});
                throw new Error(err.response.data.message);
            });
    };
};

//toDo: сделать через protectedApi

export const verifyToken =  () => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.SEND_AUTH_REQUEST});
        return api.post(
            '/auth/token/verify', {
                token: getUserInfo().token,
            })
            .then(() => dispatch({ type: AuthActionTypes.LOGIN}))
            .catch(() => {
                dispatch({ type: AuthActionTypes.AUTH_REQUEST_RETURNED});
            });
    };
};
