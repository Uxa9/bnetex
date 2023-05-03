import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { api } = useApi();

export const createTransaction = async (amount: number) => {
    return await api.post(
        '/transaction/create', {
            amount: amount,
            userId: getUserInfo().userId,
        });
};

export const getTransactions = async () => {
    return await api.get(`/transaction/user/${getUserInfo().userId}`);
};
