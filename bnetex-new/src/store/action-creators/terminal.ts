import { OrderBookStep, OrderBookStyle, TerminalType } from 'lib/types/terminal';
import { Dispatch } from 'redux';
import { TerminalAction, TerminalActionTypes } from '../actions/terminal';

export const changeTerminalType = (type: TerminalType) => {

    return async (dispatch: Dispatch<TerminalAction>) => {
        dispatch({ type: TerminalActionTypes.CHANGE_TYPE, payload: type});
    };
};

export const setIsTerminalOpen = (isOpen: boolean) => {

    return async (dispatch: Dispatch<TerminalAction>) => {
        dispatch({ type: TerminalActionTypes.SET_IS_OPEN, payload: isOpen});
    };
};

export const changeOrderBookStyle = (orderBookStyle: OrderBookStyle) => {

    return async (dispatch: Dispatch<TerminalAction>) => {
        dispatch({ type: TerminalActionTypes.CHANGE_ORDER_BOOK_STYLE, payload: orderBookStyle});
    };
};

export const changeOrderBookStep = (orderBookStep: OrderBookStep) => {

    return async (dispatch: Dispatch<TerminalAction>) => {
        dispatch({ type: TerminalActionTypes.CHANGE_ORDER_BOOK_STEP, payload: orderBookStep});
    };
};
