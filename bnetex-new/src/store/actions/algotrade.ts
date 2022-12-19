export interface AlgotradeState {
    loading: boolean;
    startTime: Date | null;
    pnl: number;
    roe: number;
    balance: number;
}

export type AlgotradeDataResponse = Omit<AlgotradeState, 'loading'>;

export enum AlgotradeActionTypes {
    SEND_REQUEST = 'SEND_REQUEST',
    GET_ALGOTRADE_DATA = 'GET_ALGOTRADE_DATA',
    REQUEST_ERROR = 'REQUEST_ERROR',
}

interface SendRequestAction {
    type: AlgotradeActionTypes.SEND_REQUEST;
}

interface GetAlgotradeDataAction {
    type: AlgotradeActionTypes.GET_ALGOTRADE_DATA;
    data: AlgotradeDataResponse;
}

interface RequestErrorAction {
    type: AlgotradeActionTypes.REQUEST_ERROR;
}

export type AlgotradeAction =
    SendRequestAction
    | GetAlgotradeDataAction
    | RequestErrorAction;
