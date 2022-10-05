import useApi from 'lib/hooks/useApi';
import { getUserId } from 'lib/utils/getUserId';

const [ protectedApi ] = useApi();

export const createTransaction = async (amount: number) => {
    return await protectedApi.post(
        '/transaction/create', {
            amount: amount,
            userId: getUserId(),
        });
};

export const getTransactions = async () => {
    return await protectedApi.get(`/transaction/user/${getUserId()}`);
};
