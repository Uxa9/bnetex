import { Dispatch } from 'redux';
import { OrderBookContents, TradePairAction, TradePairActionTypes } from 'store/actions/tradePair';
import { parseAsksOrBidsArray } from 'store/utils/tradePairUtils';

export const setTradePairPrice = (price: string) => {
    return (dispatch: Dispatch<TradePairAction>) => {
        dispatch({ type: TradePairActionTypes.SET_PRICE, price: parseFloat(price)});
    };
};

export const setOrderBook = (asks: [string, string][], bids: [string, string][]) => {
    return (dispatch: Dispatch<TradePairAction>) => {
        const data: OrderBookContents = {
            asks: parseAsksOrBidsArray(asks),
            bids: parseAsksOrBidsArray(bids),
        };
        dispatch({ type: TradePairActionTypes.SET_ORDER_BOOK, data: data });
    };
};

export const updateOrderBook = (asks: [string, string][], bids: [string, string][]) => {
    return (dispatch: Dispatch<TradePairAction>) => {
        const data: OrderBookContents = {
            asks: parseAsksOrBidsArray(asks),
            bids: parseAsksOrBidsArray(bids),
        };
        dispatch({ type: TradePairActionTypes.UPDATE_ORDER_BOOK, data: data });
    };
};

export const clearOrderBook = () => {
    return (dispatch: Dispatch<TradePairAction>) => {
        dispatch({ type: TradePairActionTypes.CLEAR_ORDER_BOOK });
    };
};
