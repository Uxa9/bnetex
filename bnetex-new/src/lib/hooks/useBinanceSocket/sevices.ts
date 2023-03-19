import axios from 'axios';

type UnparsedOrderBookSnapshot = {
    E: number; // Event time
    T: number; // Transaction time
    asks: [string, string][];
    bids: [string, string][];
    lastUpdateId: string;
}

type OrderBookSnapshot = Omit<UnparsedOrderBookSnapshot, 'E' | 'T'>;

const createOrderBookUrl = (tradePair: string) => {
    const pair = tradePair.toLowerCase();
    return `https://fapi.binance.com/fapi/v1/depth?symbol=${pair}&limit=1000`;
};

export const getOrderBookSnapshot = async (tradePair: string): Promise<OrderBookSnapshot> => {
    const { lastUpdateId, asks, bids } = await axios
        .get<UnparsedOrderBookSnapshot>(createOrderBookUrl(tradePair))
        .then(res => res.data);

    return {
        asks: asks.reverse(),
        bids,
        lastUpdateId,
    };
};
