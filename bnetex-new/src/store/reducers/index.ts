import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { terminalReducer } from './terminalReducer';
import { tradeHistoryReducer } from './tradeHistoryReducer';
import { walletReducer } from './walletReducer';
import { roePnlReducer } from './roepnl';
import { algotradeReducer } from './algotradeReducer';
import { transactionsReducer } from './transactionsReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    terminal: terminalReducer,
    wallet: walletReducer,
    tradeHistory: tradeHistoryReducer,
    roePnl: roePnlReducer,
    algotrade: algotradeReducer,
    transactions: transactionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
