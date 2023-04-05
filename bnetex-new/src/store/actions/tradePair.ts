export interface TradePairState {
    price: number | null;
    asks: [number, number][] | null;
    bids: [number, number][] | null;
    priceLoading: boolean;
    orderBookLoading: boolean;
}

export enum TradePairActionTypes {
    SET_PRICE = 'SET_PRICE',
    SET_ORDER_BOOK = 'SET_ORDER_BOOK',
    UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK',
    CLEAR_ORDER_BOOK = 'CLEAR_ORDER_BOOK',
}

export interface OrderBookContents {
    asks: [number, number][];
    bids: [number, number][];
}

interface SetPriceAction {
    type: TradePairActionTypes.SET_PRICE;
    price: number;
}

interface SetOrderBookAction {
    type: TradePairActionTypes.SET_ORDER_BOOK;
    data: OrderBookContents;
}

interface UpdateOrderBookAction {
    type: TradePairActionTypes.UPDATE_ORDER_BOOK;
    data: OrderBookContents;
}

interface ClearOrderBookAction {
    type: TradePairActionTypes.CLEAR_ORDER_BOOK;
}

export type TradePairAction = SetPriceAction
    | SetOrderBookAction
    | UpdateOrderBookAction
    | ClearOrderBookAction;
