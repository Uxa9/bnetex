import { UUID } from 'lib/types/uuid';

interface TVAvailableIntervals {
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

export type TVInterval = keyof typeof availableIntervals;

export interface KLine {
    symbol: string;
    interval: keyof typeof availableIntervals; 
    from?: number;
    to?: number;
    uniqueID?: UUID;
}
