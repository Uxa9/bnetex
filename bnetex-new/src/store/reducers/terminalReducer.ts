import { TerminalState, TerminalActionTypes, TerminalAction } from '../actions/terminal';

const initialState: TerminalState = {
    terminalType: null,
    isOpen: false,
    orderBookStyle: 'selection',
    orderBookStep: 0.1,
    error: null,
};

export const terminalReducer = (state = initialState, action: TerminalAction): TerminalState => {
    switch (action.type) {
        case TerminalActionTypes.CHANGE_TYPE:
            return {...state, terminalType: action.payload };
        case TerminalActionTypes.SET_IS_OPEN:
            return {...state, isOpen: action.payload };
        case TerminalActionTypes.CHANGE_ORDER_BOOK_STYLE:
            return { ...state, orderBookStyle: action.payload };
        case TerminalActionTypes.CHANGE_ORDER_BOOK_STEP:
            return {...state, orderBookStep: action.payload};
        case TerminalActionTypes.TERMINAL_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
