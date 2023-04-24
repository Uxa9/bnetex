import axios, { AxiosInstance } from 'axios';
import { Environment } from 'lib/types/environment';
import { getUserInfo } from 'lib/utils/getUserInfo';

interface UseApi {
    api: AxiosInstance;
    protectedApi: AxiosInstance;
}

const useApi = (): UseApi => {
    const { BACKEND_URL } = Environment;
    const baseURL = import.meta.env[BACKEND_URL];
    
    const api = axios.create({
        baseURL: baseURL,
        headers: {
            'content-type': 'application/json',
        },
    });

    const { token } = getUserInfo();

    const protectedApi = axios.create({
        baseURL: baseURL,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return {
        api,
        protectedApi,
    };
};

export default useApi;
