import axios from 'axios';
import { Environment } from 'lib/types/environment';

const useApi = () => {
    const { BACKEND_URL } = Environment;
    const baseURL = process.env[BACKEND_URL];
    
    const api = axios.create({
        baseURL: baseURL,
        headers: {
            'content-type': 'application/json',
        },
    });

    const protectedApi = axios.create({
        baseURL: baseURL,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    return [api, protectedApi];
};

export default useApi;
