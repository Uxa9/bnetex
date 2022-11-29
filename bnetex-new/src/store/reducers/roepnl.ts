import { RoePnlAction, RoePnlActionTypes, RoePnlState } from 'store/actions/roepnl';

const initialState: RoePnlState = {
    loading: false,
    dates: [],
    roe: [],
    pnl: [],
};

export const roePnlReducer = (state = initialState, action: RoePnlAction): RoePnlState => {
    switch (action.type) {
        case RoePnlActionTypes.SEND_REQUEST:
            return { dates: [], roe: [], pnl: [], loading: true };
        case RoePnlActionTypes.GET_ROE_PNL:
        case RoePnlActionTypes.GET_HISTORICAL_DATA:
            return { loading: false, dates: action.data.dates, roe: action.data.roe, pnl: action.data.pnl };
        case RoePnlActionTypes.REQUEST_ERROR: 
            return { ...state, loading: false };
        default:
            return state;
    }
};
