import { Transaction } from 'lib/types/transaction';

export interface TransactionState {
    loading: boolean;
    transactions: Transaction[];
}

export enum TransactionActionTypes {
    SEND_REQUEST = 'SEND_REQUEST',
    GET_TRANSACTIONS = 'GET_TRANSACTIONS',
    REQUEST_ERROR = 'REQUEST_ERROR',
}

interface SendRequestAction {
    type: TransactionActionTypes.SEND_REQUEST;
}

interface GetTransactionsAction {
    type: TransactionActionTypes.GET_TRANSACTIONS;
    data: Transaction[];
}

interface RequestErrorAction {
    type: TransactionActionTypes.REQUEST_ERROR;
}

export type TransactionAction =
    SendRequestAction
    | GetTransactionsAction
    | RequestErrorAction;
