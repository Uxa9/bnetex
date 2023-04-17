import { TradePairAction, TradePairActionTypes, TradePairState } from 'store/actions/tradePair';
import { mergeOrderBookUpdate } from 'store/utils/tradePairUtils';

const initialState: TradePairState = {
    priceLoading: true,
    orderBookLoading: true,
    price: null,
    asks: null,
    bids: null,
};

export const tradePairReducer = (state = initialState, action: TradePairAction): TradePairState => {
    switch (action.type) {
        case TradePairActionTypes.SET_PRICE:
            return { ...state, priceLoading: false, price: action.price };
        case TradePairActionTypes.SET_ORDER_BOOK:
            return { ...state, orderBookLoading: false, asks: action.data.asks, bids: action.data.bids };
        case TradePairActionTypes.UPDATE_ORDER_BOOK: {
            if (!state.asks || !state.bids) return state;

            const mergedAsks = mergeOrderBookUpdate(state.asks, action.data.asks);
            const mergedBids = mergeOrderBookUpdate(state.bids, action.data.bids);
            return { ...state, asks: mergedAsks, bids: mergedBids };
        }
        case TradePairActionTypes.CLEAR_ORDER_BOOK:
            return { ...state, orderBookLoading: true, asks: null, bids: null };
        default:
            return state;
    }
};
