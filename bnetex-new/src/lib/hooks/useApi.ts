import axios from 'axios';
import { Environment } from 'lib/types/environment';

const useApi = () => {
    const { BACKEND_URL } = Environment;
    const baseURL = import.meta.env[BACKEND_URL];
    
    const api = axios.create({
        baseURL: baseURL,
        headers: {
            'content-type': 'application/json',
        },
    });

    const getToken = () => {
        const userInfo = localStorage.getItem('userInfo-BNETEX');
        return userInfo ? JSON.parse(userInfo).token : '';
    };

    const protectedApi = axios.create({
        baseURL: baseURL,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
    });

    return [api, protectedApi];
};

export default useApi;
