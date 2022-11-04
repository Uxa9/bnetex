import useApi from 'lib/hooks/useApi';
import { getUserId } from 'lib/utils/getUserId';
import { getToken } from './utils/getToken';

const [ protectedApi ] = useApi();

export const startInvestTrading = async (amount: number) => {

    return await protectedApi.post(
        '/users/startInvest', {
            amount: amount,
            userId: getUserId(),
        },
        {headers: {
            'Authorization': `Bearer ${getToken()}`,
        }});
};

export const stopInvestTrading = async () => {
    return await protectedApi.get(
        `/users/stopInvest/${getUserId()}`,
        {headers: {
            'Authorization': `Bearer ${getToken()}`,
        }});
};
