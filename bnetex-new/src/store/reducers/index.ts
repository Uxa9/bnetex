import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { terminalReducer } from './terminalReducer';
import { tradeHistoryReducer } from './tradeHistoryReducer';
import { userReducer } from './userReducer';
import { roePnlReducer } from './roepnl';

export const rootReducer = combineReducers({
    auth: authReducer,
    terminal: terminalReducer,
    user: userReducer,
    tradeHistory: tradeHistoryReducer,
    roePnl: roePnlReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
