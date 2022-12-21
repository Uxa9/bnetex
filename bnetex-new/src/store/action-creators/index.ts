import * as AuthActionCreators from './auth';
import * as TerminalActionCreators from './terminal';
import * as UserActionCreators from './wallet';
import * as TradeHistoryActionCreators from './tradeHistory';
import * as RoeAndPnlActionCreators from './roepnl';
import * as AlgotradeActionCreators from './algotrade';

export default {
    ...AuthActionCreators,
    ...TerminalActionCreators,
    ...UserActionCreators,
    ...TradeHistoryActionCreators,
    ...RoeAndPnlActionCreators,
    ...AlgotradeActionCreators,
};
