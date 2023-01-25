import {AlgotradeAction, AlgotradeActionTypes, AlgotradeState} from 'store/actions//algotrade';

const initialState: AlgotradeState = {
    loading: false,
    balance: 0,
    startTime: null,
    startSessionTime: null,
    pnl: 0,
    roe: 0,
    markRefreshFlag: false,
    viewType: "trade",
};

export const algotradeReducer = (state = initialState, action: AlgotradeAction): AlgotradeState => {
    switch (action.type) {
        case AlgotradeActionTypes.SEND_REQUEST:
            return { ...state, loading: true };
        case AlgotradeActionTypes.GET_ALGOTRADE_DATA:
            return { ...state, loading: false, ...action.data};
        case AlgotradeActionTypes.REFRESH_TV_MARKS:
            return {...state, markRefreshFlag: !state.markRefreshFlag};
        case AlgotradeActionTypes.REQUEST_ERROR:
            return { ...state, loading: false };
        case AlgotradeActionTypes.CHANGE_VIEW_TYPE:
            return { ...state, viewType: action.payload }
        default:
            return state;
    }
};
