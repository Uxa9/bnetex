import { LibrarySymbolInfo, ResolutionString, SearchSymbolResultItem } from 'charting_library/charting_library';
import { millisecondsInHour, millisecondsInMinute } from 'date-fns/constants';
import { availableIntervals, BinanceSymbol, PeriodScope, PriceFilter } from './types';

/**
 * Возвращает число миллисекунд в интервале из TV
 * @param intervalKey
 * @returns
 */
export const getIntervalDuration = (intervalKey: ResolutionString): number => {
    const interval = availableIntervals[intervalKey];
    if (!interval) throw new Error('Incorrect interval');

    const timeKey: string | undefined = interval.split('').at(-1);
    const timeValue: number = Number(interval.slice(0, -1));

    switch (timeKey) {
        case 'm': {
            return timeValue * millisecondsInMinute;
        }
        case 'h': {
            return timeValue * millisecondsInHour;
        }
        case 'd': {
            return timeValue * millisecondsInHour * 24;
        }
        case 'w': {
            return timeValue * millisecondsInHour * 24 * 7;
        }
        default: {
            return 1;
        }
    }
};

/**
 * Функция разбивает запрошенный интервал времени на несколько интервалов
 * каждый из которых вмещает не более чем maxKlineAmount свечек
 * @param period
 * @param resolution
 * @param maxKlineAmount
 * @returns
 */
export const separateKlineRequestInterval = (
    period: PeriodScope,
    resolution: ResolutionString,
    maxKlineAmount = 500
): PeriodScope[] => {

    const barDuration = getIntervalDuration(resolution);
    const separatedIntervalRequests: PeriodScope[] = [];
    const maxKlineAmountDuration = maxKlineAmount * barDuration;

    let currentIntervalStart = period.from;

    while (currentIntervalStart < period.to) {
        const currentIntervalEnd = currentIntervalStart + maxKlineAmountDuration;

        const requestTimeframe: PeriodScope = {
            from: currentIntervalStart,
            to: currentIntervalEnd > period.to ? period.to : currentIntervalEnd,
        };

        separatedIntervalRequests.push(requestTimeframe);
        currentIntervalStart = currentIntervalStart + maxKlineAmountDuration;
    }

    return separatedIntervalRequests;
};

const getPricescale = (priceFilter: PriceFilter | undefined) => {
    return Math.round(1 / parseFloat(priceFilter?.tickSize ?? '1'));
};

export const createSymbolInfo = (symbol: BinanceSymbol): LibrarySymbolInfo => {
    return {
        name: symbol.symbol,
        format: 'volume',
        full_name: symbol.symbol,
        description: symbol.baseAsset + ' / ' + symbol.quoteAsset,
        ticker: symbol.symbol,
        exchange: 'Binance',
        listed_exchange: 'Binance',
        type: 'crypto',
        session: '24x7',
        minmov: 1,
        pricescale: getPricescale(symbol.priceFilter),
        timezone: 'Etc/UTC',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        currency_code: symbol.quoteAsset,
        supported_resolutions: [
            '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D',
        ] as ResolutionString[],
    };
};


export const symbolToSearchSymbol = (symbol: BinanceSymbol): SearchSymbolResultItem => {
    return {
        symbol: symbol.symbol,
        full_name: symbol.symbol,
        description: `${symbol.baseAsset} / ${symbol.quoteAsset}`,
        exchange: 'Binance',
        ticker: symbol.symbol,
        type: 'Futures',
    };
};
