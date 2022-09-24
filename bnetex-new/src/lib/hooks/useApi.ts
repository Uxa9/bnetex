import axios from 'axios';

const useApi = () => {
    // По хорошему убрать в .env
    const baseURL = 'https://api.bnetex.com';
    
    const api = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-type': 'application/json',
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
