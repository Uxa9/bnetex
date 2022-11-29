import * as AuthActionCreators from './auth';
import * as TerminalActionCreators from './terminal';
import * as UserActionCreators from './wallet';
import * as TradeHistoryActionCreators from './tradeHistory';
import * as RoeAndPnlActionCreators from './roepnl';

export default {
    ...AuthActionCreators,
    ...TerminalActionCreators,
    ...UserActionCreators,
    ...TradeHistoryActionCreators,
    ...RoeAndPnlActionCreators,
};
