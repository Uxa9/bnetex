import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { protectedApi } = useApi();

export const createTransaction = async (amount: number) => {
    return await protectedApi.post(
        '/transaction/create', {
            amount: amount,
            userId: getUserInfo().userId,
        });
};

export const getTransactions = async () => {
    return await protectedApi.get(`/transaction/user/${getUserInfo().userId}`);
};
