import { TransactionAction, TransactionActionTypes, TransactionState } from 'store/actions/transactions';

const initialState: TransactionState = {
    loading: false,
    transactions: [],
};

export const transactionsReducer = (state = initialState, action: TransactionAction): TransactionState => {
    switch (action.type) {
        case TransactionActionTypes.SEND_REQUEST:
            return { ...state, loading: true };
        case TransactionActionTypes.GET_TRANSACTIONS:
            return { ...state, loading: false, transactions: action.data};
        case TransactionActionTypes.REQUEST_ERROR:
            return { ...state, loading: false };
        default:
            return state;
    }
};
