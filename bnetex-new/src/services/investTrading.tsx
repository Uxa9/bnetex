import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { api } = useApi();

export const startInvestTrading = async (amount: number) => {

    return await api.post(
        '/users/startInvest', {
            amount: amount,
            userId: getUserInfo().userId,
        });
};

export const stopInvestTrading = async () => {
    return await api.get(
        `/users/stopInvest`
    );
};
