import axios from 'axios';
import { UUID } from 'lib/types/uuid';
import { availableIntervals, KLine, TVInterval } from './types';

export const getExchangeServerTime = () => binanceRequest('/time').then(res => res.serverTime);

export const getSymbols = () => binanceRequest('/exchangeInfo').then(res => res.symbols);

// https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
export const getKlines = ({ symbol, interval, from, to }: KLine) => {
    const parsedInterval = availableIntervals[interval]; // set interval

    return binanceRequest('/klines', { 
        symbol: symbol.toUpperCase(),
        interval: parsedInterval, 
        startTime: from ? from * 1000: undefined, 
        endTime: to ? to * 1000: undefined, 
    })
        .then(res => {
            console.log(res);
            
            return res.map((i: any[]) => ({
                time: parseFloat(i[0]),
                open: parseFloat(i[1]),
                high: parseFloat(i[2]),
                low: parseFloat(i[3]),
                close: parseFloat(i[4]),
                volume: parseFloat(i[5]),
            }));
        })
        .catch(err => console.log(err));
};

export const subscribeKline = ({ symbol, interval, uniqueID }: KLine, callback: any) => {
    console.log(symbol, interval, uniqueID);
    console.log(callback);
    
    // interval = availableIntervals[interval]; // set interval
    // return api.stream.kline({ symbol, interval, uniqueID }, res => {
    //     const candle = formatingKline(res.kline);
    //     callback(candle);
    // });
};

export const unsubscribeKline = (uniqueID: UUID) => {
    // return api.stream.close.kline({ uniqueID });
};

export const checkInterval = (interval: TVInterval) => !!availableIntervals[interval];

// helpers ------------------------

interface formattableKline { 
    openTime: Date,
    open: any,
    high: any,
    low: any,
    close: any,
    volume: any 
}

function formatKline({ openTime, open, high, low, close, volume }: formattableKline) {
    return {
        time: openTime,
        open,
        high,
        low,
        close,
        volume,
    };
}

function binanceRequest(url: string, params = {}) {
    return axios({
        baseURL: 'https://api.binance.com/api/v3',
        method: 'get',
        url,
        params,
    })
        .then(res => res.data)
        .catch(res => console.log(res));
}

function candle(i: any[]) {
    return {
        o: parseFloat(i[1]),
        h: parseFloat(i[2]),
        l: parseFloat(i[3]),
        c: parseFloat(i[4]),
        v: parseFloat(i[5]),
        ts: i[0],
        price: parseFloat(i[4]),
        openTime: i[0],
        closeTime: i[6],
        trades: i[8],
    };
}
