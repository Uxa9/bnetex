import axios, { AxiosError, HttpStatusCode } from 'axios';
import { Environment } from 'lib/types/environment';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { logoutUser } from 'store/action-creators/auth';
import { store } from 'store';

export const api = axios.create({
    baseURL: import.meta.env[Environment.BACKEND_URL],
});

api.interceptors.request.use(config => {
    const { token } = getUserInfo();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(res => res, async (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
        store.dispatch(logoutUser());
    }

    return Promise.reject(error);
});
