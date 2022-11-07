import {TradeHistoryState, TradeHistoryAction, TradeHistoryActionTypes} from '../actions/tradeHistory';

const initialState: TradeHistoryState = {
    tradeHistory: [],
    loading: false,
    error: null,
};

export const tradeHistoryReducer = (state = initialState, action: TradeHistoryAction): TradeHistoryState => {
    switch (action.type) {
        case TradeHistoryActionTypes.FETCH_HISTORY:
            return { ...state, loading: true, error: null };
        case TradeHistoryActionTypes.FETCH_HISTORY_SUCCESS:
            return { ...state, loading: false, tradeHistory: action.tradeHistory };
        case TradeHistoryActionTypes.FETCH_HISTORY_ERROR:
            return { tradeHistory: [], loading: false, error: action.error };
        default:
            return state;
    }
};
