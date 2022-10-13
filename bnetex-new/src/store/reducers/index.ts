import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { terminalReducer } from './terminalReducer';
import { userReducer } from './userReducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    terminal: terminalReducer,
    user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
