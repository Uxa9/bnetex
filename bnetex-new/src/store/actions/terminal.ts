import { OrderBookStep, OrderBookStyle, TerminalType } from 'lib/types/terminal';

export interface TerminalState {
    terminalType: TerminalType | undefined,
    isOpen: boolean,
    orderBookStyle: OrderBookStyle,
    orderBookStep: OrderBookStep,
    error: null | string
}

export enum TerminalActionTypes {
    CHANGE_TYPE = 'CHANGE_TYPE',
    SET_IS_OPEN = 'SET_IS_OPEN',
    CHANGE_ORDER_BOOK_STYLE = 'CHANGE_ORDER_BOOK_STYLE',
    CHANGE_ORDER_BOOK_STEP = 'CHANGE_ORDER_BOOK_STEP',
    TERMINAL_ERROR = 'TERMINAL_ERROR',
}

interface ChangeTypeTerminalAction {
    type: TerminalActionTypes.CHANGE_TYPE
    payload: TerminalType
}

interface SetIsOpenTerminalAction {
    type: TerminalActionTypes.SET_IS_OPEN
    payload: boolean
}

interface ChangeOrderBookStyleTerminalAction {
    type: TerminalActionTypes.CHANGE_ORDER_BOOK_STYLE
    payload: OrderBookStyle
}

interface ChangeOrderBookStepTerminalAction {
    type: TerminalActionTypes.CHANGE_ORDER_BOOK_STEP
    payload: OrderBookStep
}

interface TerminalErrorAction {
    type: TerminalActionTypes.TERMINAL_ERROR
    payload: string
}

export type TerminalAction = ChangeTypeTerminalAction | SetIsOpenTerminalAction | ChangeOrderBookStyleTerminalAction
| ChangeOrderBookStepTerminalAction | TerminalErrorAction;
