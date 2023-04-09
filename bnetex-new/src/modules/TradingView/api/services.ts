import axios from 'axios';
import { Bar, SearchSymbolResultItem } from 'charting_library/charting_library';
import useApi from 'lib/hooks/useApi';
import { availableIntervals, BinanceSymbol, KLine, TVInterval } from './types';
import { symbolToSearchSymbol } from './utils';

const { api } = useApi();

export const getExchangeServerTime = () => binanceRequest('/time').then(res => res.serverTime);

export const getSymbols = (filterString: string) =>
    api.post<BinanceSymbol[]>('/invest-trading/getBinanceSymbols', { filterString });

export const searchSymbols = (filterString: string): Promise<SearchSymbolResultItem[]> => {
    return getSymbols(filterString)
        .then(res => res.data.map(it => symbolToSearchSymbol(it)));
};

// получить исторические данные свечек
export const getKlines = ({ symbol, interval, from, to }: KLine): Promise<Bar[]> => {
    const parsedInterval = availableIntervals[interval]; // set interval

    return binanceRequest('/klines', {
        symbol: symbol.toUpperCase(),
        interval: parsedInterval,
        startTime: from,
        endTime: to,
    })
        .then(res => {
            return res.map((i: any[]) => ({
                time: parseFloat(i[0]),
                open: parseFloat(i[1]),
                high: parseFloat(i[2]),
                low: parseFloat(i[3]),
                close: parseFloat(i[4]),
            }));
        });
};

export const checkInterval = (interval: TVInterval) => !!availableIntervals[interval];

function binanceRequest(url: string, params = {}) {
    return axios({
        baseURL: 'https://fapi.binance.com/fapi/v1',
        method: 'get',
        url,
        params,
    })
        .then(res => res.data);
}
