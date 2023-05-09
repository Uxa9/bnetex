import { api } from 'config/api';

const getUserTransactions = async () => {
    return await api.get(
        '/request/user',
    )
        .then((response) => {
            return response.data;
        });
};

export default getUserTransactions;
