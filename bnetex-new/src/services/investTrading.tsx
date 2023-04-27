import useApi from 'lib/hooks/useApi';
import { getUserInfo } from 'lib/utils/getUserInfo';

const { protectedApi } = useApi();

export const startInvestTrading = async (amount: number) => {

    return await protectedApi.post(
        '/users/startInvest', {
            amount: amount,
            userId: getUserInfo().userId,
        });
};

export const stopInvestTrading = async () => {
    return await protectedApi.get(
        `/users/stopInvest`
    );
};
