import axios, { AxiosInstance } from 'axios';
import { Environment } from 'lib/types/environment';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { logoutUser } from 'store/action-creators/auth';
import { store } from 'store';

interface UseApi {
    api: AxiosInstance;
    // protectedApi: AxiosInstance;
}

const useApi = (): UseApi => {
    const { BACKEND_URL } = Environment;
    const baseURL = import.meta.env[BACKEND_URL];

    const { token } = getUserInfo();

    const api = axios.create({
        baseURL: baseURL,
        headers: {
            'Authorization': `Bearer ${token || ""}`,
        },
    });

    api.interceptors.response.use((res) => {
        return res;
    },
        (error) => {
            if (error.response.status === 401) {
                store.dispatch(logoutUser());
            }            
            
            throw error;
        }
    );

    // const protectedApi = axios.create({
    //     baseURL: baseURL,
    //     headers: {
    //         'Authorization': `Bearer ${token || ""}`,
    //     },
    // });

    // protectedApi.interceptors.response.use((res) => {return res}, 
    //     (error) => {  
    //         if (error.response.status === 401) {
    //             store.dispatch(logoutUser())
    //         }

    //         throw new Error(error);
    //     }
    // );

    return {
        api,
        // protectedApi,
    };
};

export default useApi;

