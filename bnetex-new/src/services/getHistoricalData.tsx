import { api } from 'config/api';

interface ReturnType {
    dates: string[],
    pnlValues: number[],
    roeValues: number[]
}

export const getHistoricalData = async (period: number, amount: number): Promise<ReturnType> => {
    const result = await api.post('positions/getHistData',
        {
            period,
            amount,
        });


    return {
        dates: result.data.dates,
        pnlValues: result.data.pnlValues,
        roeValues: result.data.roeValues,
    };
};

export const getHistoricalDataOrders = async (period: number) => {
    return await api.get(`/positions/${period}`);
};
