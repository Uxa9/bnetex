import axios from 'axios';
import { availableIntervals, KLine, TVInterval } from './types';

export const getExchangeServerTime = () => binanceRequest('/time').then(res => res.serverTime);

export const getSymbols = () => binanceRequest('/exchangeInfo').then(res => res.symbols);

// получить исторические данные свечек
export const getKlines = ({ symbol, interval, from, to }: KLine) => {
    const parsedInterval = availableIntervals[interval]; // set interval

    return binanceRequest('/klines', { 
        symbol: symbol.toUpperCase(),
        interval: parsedInterval, 
        startTime: from ? from * 1000 : undefined, 
        endTime: to ? to * 1000 : undefined, 
    })
        .then(res => {
            return res.map((i: any[]) => ({
                time: parseFloat(i[0]),
                open: parseFloat(i[1]),
                high: parseFloat(i[2]),
                low: parseFloat(i[3]),
                close: parseFloat(i[4]),
                volume: parseFloat(i[5]),
            }));
        });
};


export const checkInterval = (interval: TVInterval) => !!availableIntervals[interval];

function binanceRequest(url: string, params = {}) {
    return axios({
        baseURL: 'https://api.binance.com/api/v3',
        method: 'get',
        url,
        params,
    })
        .then(res => res.data);
}
