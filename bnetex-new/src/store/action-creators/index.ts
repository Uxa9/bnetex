import * as AuthActionCreators from './auth';
import * as TerminalActionCreators from './terminal';

export default {
    ...AuthActionCreators,
    ...TerminalActionCreators,
};
