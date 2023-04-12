import { BinanceSymbol } from 'modules/TradingView/api/types';

export type BinanceSocketType = 'trader' | 'investor';

export type BinanceSymbolAssets = Pick<BinanceSymbol, 'baseAsset' | 'quoteAsset'>

export const binanceWSEndpoint = 'wss://fstream.binance.com/stream?streams=';

export enum AvailableSocketKeys {
    DEPTH = '@depth',
    TICKER = '@miniTicker',
}

const traderSocketKeysArray = [AvailableSocketKeys.DEPTH, AvailableSocketKeys.TICKER] as const;

export const socketKeysRecord: Record<BinanceSocketType, readonly string[]> = {
    trader: traderSocketKeysArray,
    investor: [],
};

/**
 * Данные, приходящие с binance по запросу @miniTicker
 */
export type UnparsedTickerData = {
    E: number; // Event time
    c: string; // Close price
    e: string; // Event type (24hrMiniTicker)
    h: string; // High price
    l: string; // Low price
    o: string; // Open price
    q: string; // Total qoute asset volume (vol of USDT in case of BTCUSDT symbol)
    s: string; // Symbol (ex: BTCUSDT)
    v: string; //  Total base asset volume (vol of BTC in case of BTCUSDT symbol)
}

/**
 * Распаршенная в объект строка из message сокета @miniTicker
 */
export type TickerSocketMessage = {
    stream: AvailableSocketKeys.TICKER;
    data: UnparsedTickerData;
}

/**
 * data из TickerSocketMessage в читаемом формате
 */
export type ParsedTickerData = {
    streamKey: AvailableSocketKeys.TICKER,
    currentPrice: string,
}

/**
 * Данные, приходящие с binance по запросу @depth
 */
export type UnparsedDepthData = {
    E: number; // Event time
    T: number; // Transaction time
    U: number; // First update ID in event
    a: [string, string][]; // asks
    b: [string, string][]; // bids
    e: string; // Event type (depthUpdate)
    pu: number; // Final update Id in last stream(ie `u` in last stream)
    s: string; // Symbol (ex: BTCUSDT)
    u: number; // Final update ID in event
}

/**
 * Распаршенная в объект строка из message сокета @depth
 */
export type DepthSocketMessage = {
    stream: AvailableSocketKeys.DEPTH;
    data: UnparsedDepthData;
}

/**
 * data из DepthSocketMessage в читаемом формате
 */
export type ParsedDepthData = {
    streamKey: AvailableSocketKeys.DEPTH,
    asks: [string, string][],
    bids: [string, string][],
    firstUpdate: number,
    finalUpdate: number,
    prevUpdate: number,
}

/**
 * Объект, распаршенный из строки message. Data в не читаемом виде.
 */
export type RawSocketMessage = TickerSocketMessage | DepthSocketMessage;

/**
 * Объект RawSocketMessage, распаршенный в читаемый вид.
 */
export type ParsedSocketMessage = ParsedTickerData | ParsedDepthData;
