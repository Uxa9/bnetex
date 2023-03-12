export type BinanceSocketType = 'trader' | 'investor';

export const binanceWSEndpoint = 'wss://stream.binance.com/stream?streams=';

const traderSocketKeysArray = ['@depth20', '@miniTicker'];

export const socketKeysRecord: Record<BinanceSocketType, string[]> = {
    trader: traderSocketKeysArray,
    investor: [],
};
