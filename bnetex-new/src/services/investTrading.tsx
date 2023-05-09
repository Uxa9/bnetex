import { api } from 'config/api';

export const startInvestTrading = async (amount: number) => {
    return await api.post(
        '/users/startInvest', {
            amount: amount,
        });
};

export const stopInvestTrading = async () => {
    return await api.get(
        '/users/stopInvest'
    );
};
