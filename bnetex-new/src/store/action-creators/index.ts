import * as AuthActionCreators from './auth';
import * as TerminalActionCreators from './terminal';
import * as UserActionCreators from './user';
import * as TradeHistoryActionCreators from './tradeHistory';

export default {
    ...AuthActionCreators,
    ...TerminalActionCreators,
    ...UserActionCreators,
    ...TradeHistoryActionCreators,
};
