import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { terminalReducer } from './terminalReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    terminal: terminalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
