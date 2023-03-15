import { DatafeedConfiguration, PeriodParams, ResolutionString } from 'charting_library/charting_library';
import { UUID } from 'lib/types/uuid';

export interface TVAvailableIntervals {
    [key: string]: string;
}

export const availableIntervals: TVAvailableIntervals = {
    '1': '1m',
    '3': '3m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    '120': '2h',
    '240': '4h',
    '360': '6h',
    '480': '8h',
    '720': '12h',
    'D': '1d',
    '1D': '1d',
    '3D': '3d',
    'W': '1w',
    '1W': '1w',
    'M': '1M',
    '1M': '1M',
};

// данные интервалы не должны вызывать getMarks()
export const forbiddenMarkResolutions: (keyof TVAvailableIntervals)[] = ['1D', '3D'];

export type TVInterval = keyof typeof availableIntervals;

export interface KLine {
    symbol: string;
    interval: keyof typeof availableIntervals;
    from?: number;
    to?: number;
    uniqueID?: UUID;
}

export type HistoryPeriod = 1 | 3 | 6;

export type PeriodScope = Pick<PeriodParams, 'from' | 'to'>

export type BinanceSymbol = {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    priceFilter?: PriceFilter;
}

export type PriceFilter = {
    maxPrice: string;
    minPrice: string;
    tickSize: string;
};

export const configurationData: DatafeedConfiguration = {
    supports_marks: true,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: [
        '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D',
    ] as ResolutionString[],
};
