import * as AuthActionCreators from './auth';
import * as TerminalActionCreators from './terminal';
import * as UserActionCreators from './user';

export default {
    ...AuthActionCreators,
    ...TerminalActionCreators,
    ...UserActionCreators
};
