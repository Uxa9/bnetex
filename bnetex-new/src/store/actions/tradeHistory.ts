import { TradeHistoryItem } from 'lib/types/tradeHistoryItem';

export interface TradeHistoryState {
    tradeHistory: TradeHistoryItem[];
    loading: boolean;
    error: string | null;
}

export enum TradeHistoryActionTypes {
    FETCH_HISTORY = 'FETCH_HISTORY',
    FETCH_HISTORY_SUCCESS = 'FETCH_HISTORY_SUCCESS',
    FETCH_HISTORY_ERROR = 'FETCH_HISTORY_ERROR',
}

interface FetchHistoryAction {
    type: TradeHistoryActionTypes.FETCH_HISTORY;
}

interface FetchHistorySuccessAction {
    type: TradeHistoryActionTypes.FETCH_HISTORY_SUCCESS;
    tradeHistory: TradeHistoryItem[];
}

interface FetchHistoryErrorAction {
    type: TradeHistoryActionTypes.FETCH_HISTORY_ERROR;
    error: string;
}


export type TradeHistoryAction = FetchHistoryAction | FetchHistorySuccessAction | FetchHistoryErrorAction;
