import { AlgotradeAction, AlgotradeActionTypes, AlgotradeState } from 'store/actions//algotrade';

const initialState: AlgotradeState = {
    loading: false,
    balance: 0,
    startTime: null,
    startSessionTime: null,
    pnl: 0,
    roe: 0,
};

export const algotradeReducer = (state = initialState, action: AlgotradeAction): AlgotradeState => {
    switch (action.type) {
        case AlgotradeActionTypes.SEND_REQUEST:
            return { ...state, loading: true };
        case AlgotradeActionTypes.GET_ALGOTRADE_DATA:
            return { ...state, loading: false, ...action.data};
        case AlgotradeActionTypes.REQUEST_ERROR:
            return { ...state, loading: false };
        default:
            return state;
    }
};
