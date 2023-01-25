export interface AlgotradeState {
    loading: boolean;
    startTime: Date | null;
    startSessionTime: Date | null;
    pnl: number;
    roe: number;
    balance: number;
    markRefreshFlag: boolean;
    viewType: string;
}

export type AlgotradeDataResponse = Omit<AlgotradeState, 'loading'>;

export enum AlgotradeActionTypes {
    SEND_REQUEST = 'SEND_REQUEST',
    GET_ALGOTRADE_DATA = 'GET_ALGOTRADE_DATA',
    REQUEST_ERROR = 'REQUEST_ERROR',
    REFRESH_TV_MARKS = 'REFRESH_TV_MARKS',
    CHANGE_VIEW_TYPE = 'CHANGE_VIEW_TYPE',
}

interface SendRequestAction {
    type: AlgotradeActionTypes.SEND_REQUEST;
}

interface GetAlgotradeDataAction {
    type: AlgotradeActionTypes.GET_ALGOTRADE_DATA;
    data: AlgotradeDataResponse;
}

interface TriggerTVMarkRefreshAction {
    type: AlgotradeActionTypes.REFRESH_TV_MARKS;
}

interface RequestErrorAction {
    type: AlgotradeActionTypes.REQUEST_ERROR;
}

interface ChangeViewType {
    type: AlgotradeActionTypes.CHANGE_VIEW_TYPE;
    payload: string;
}

export type AlgotradeAction =
    SendRequestAction
    | GetAlgotradeDataAction
    | RequestErrorAction
    | TriggerTVMarkRefreshAction
    | ChangeViewType;
