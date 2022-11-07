import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { terminalReducer } from './terminalReducer';
import { tradeHistoryReducer } from './tradeHistoryReducer';
import { userReducer } from './userReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    terminal: terminalReducer,
    user: userReducer,
    tradeHistory: tradeHistoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
