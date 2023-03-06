interface TradeCupPosition {
    amount: number;
    price: number;
}

interface UserPosition {
    symbol: string;
    amount: number;
    enterPrice: number;

}

// export interface TraderState {
//     tickerPrice: number;
//     tradeCup: TradeCupPosition[];
// }

export interface TraderState {
    messages: Object[]
}

export enum TraderActionTypes {
    TEST = 'TEST',
}

export type TraderAction = any