export type HistoryPeriod = 1 | 3 | 6 | null;

export interface AlgotradeState {
    loading: boolean;
    startTime: Date | null;
    startSessionTime: Date | null;
    pnl: number;
    roe: number;
    balance: number;
    historyPeriod: HistoryPeriod;
}

export type AlgotradeDataResponse = Omit<AlgotradeState, 'loading'>;

export enum AlgotradeActionTypes {
    SEND_REQUEST = 'SEND_REQUEST',
    GET_ALGOTRADE_DATA = 'GET_ALGOTRADE_DATA',
    REQUEST_ERROR = 'REQUEST_ERROR',
    CHANGE_ALGOTRADE_MODE = 'CHANGE_ALGOTRADE_MODE',
}

interface SendRequestAction {
    type: AlgotradeActionTypes.SEND_REQUEST;
}

interface GetAlgotradeDataAction {
    type: AlgotradeActionTypes.GET_ALGOTRADE_DATA;
    data: AlgotradeDataResponse;
}

interface ChangeAlgotradeModeAction {
    type: AlgotradeActionTypes.CHANGE_ALGOTRADE_MODE;
    historyPeriod: HistoryPeriod;
}

interface RequestErrorAction {
    type: AlgotradeActionTypes.REQUEST_ERROR;
}

export type AlgotradeAction =
    SendRequestAction
    | GetAlgotradeDataAction
    | RequestErrorAction
    | ChangeAlgotradeModeAction;
