export interface RoePnlState {
    loading: boolean,
    dates: string[],
    roe: number[],
    pnl: number[],
}

export interface SuccessfulRoePnlRequestData {
    dates: string[],
    roeValues: number[],
    pnlValues: number[],
}

export enum RoePnlActionTypes {
    SEND_REQUEST = 'SEND_REQUEST',
    GET_ROE_PNL = 'GET_ROE_PNL',
    GET_HISTORICAL_DATA = 'GET_HISTORICAL_DATA',
    REQUEST_ERROR = 'REQUEST_ERROR',
}

interface SendRequestAction {
    type: RoePnlActionTypes.SEND_REQUEST;
}

interface GetRoePnlAction {
    type: RoePnlActionTypes.GET_ROE_PNL;
    data: Omit<RoePnlState, 'loading'>;
}

interface GetHistoricalDataAction {
    type: RoePnlActionTypes.GET_HISTORICAL_DATA;
    data: Omit<RoePnlState, 'loading'>;
}

interface RequestErrorAction {
    type: RoePnlActionTypes.REQUEST_ERROR;
}

export type RoePnlAction = SendRequestAction | GetRoePnlAction | GetHistoricalDataAction 
    | RequestErrorAction;
