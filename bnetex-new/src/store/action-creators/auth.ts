import { Dispatch } from 'redux';
import { AuthAction, AuthActionTypes } from '../actions/auth';

// Тут будем делать запросы на бек для получения JWT токена авторизации пользователя


// props: login: String, password: String
export const login = () => {

    return async (dispatch: Dispatch<AuthAction>) => {
        try {
            // const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {
            //     login, password,
            // });
            // localStorage.setItem('token', response.data.token);
            dispatch({ type: AuthActionTypes.LOGIN});
            // return response.status;

            localStorage.setItem('token', 'JWT');
        } catch (e) {
            dispatch({
                type: AuthActionTypes.LOGIN_ERROR,
                payload: 'Произошла ошибка при авторизации',
            });
        }
    };
};

export const checkAuthUser = () => {
    return async (dispatch: Dispatch<AuthAction>) => {
        try {
            // const response = await $api.get('/auth/check-auth');
            // dispatch({ type: AuthActionTypes.LOGIN });
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
