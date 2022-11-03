import useApi from "lib/hooks/useApi";

const [api] = useApi();

interface ReturnType {
    dates: string[],
    pnlValues: number[],
    roeValues: number[]
}

export const getHistoricalData = async (period: number, amount: number): Promise<ReturnType> => {
    const result = await api.post('positions/getHistData',
        {
            period,
            amount
        });

    return {
        dates: result.data.dates,
        pnlValues: result.data.pnlValues,
        roeValues: result.data.roeValues
    };
}