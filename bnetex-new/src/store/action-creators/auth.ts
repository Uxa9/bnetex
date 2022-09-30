import { AxiosError, AxiosResponse } from 'axios';
import useApi from 'lib/hooks/useApi';
import { Dispatch } from 'redux';
import { AuthAction, AuthActionTypes } from '../actions/auth';

const [api] = useApi();

export const login = (email: string, password: string) => {

    return async (dispatch: Dispatch<AuthAction>) => {
        await api
            .post('/auth/login', {
                email, password,
            })
            .then((response: AxiosResponse) => {
                console.log(response);
                dispatch({ type: AuthActionTypes.LOGIN});
            })
            .catch((error: Error | AxiosError) => {
                console.log(error);
                dispatch({
                    type: AuthActionTypes.LOGIN_ERROR,
                    payload: 'Произошла ошибка при авторизации',
                });
            });
    };
};

export const checkAuthUser = () => {
    return async (dispatch: Dispatch<AuthAction>) => {
        try {
            // const response = await $api.get('/auth/check-auth');
            dispatch({ type: AuthActionTypes.LOGIN });
        } catch (e) {
            dispatch({
                type: AuthActionTypes.LOGIN_ERROR,
                payload: 'Произошла ошибка при проверке авторизации',
            });
            localStorage.removeItem('token');
        }
    };
};

export const logoutUser = () => {
    return (dispatch: Dispatch<AuthAction>) => {
        dispatch({ type: AuthActionTypes.LOGOUT });
        localStorage.removeItem('token');
    };
};
