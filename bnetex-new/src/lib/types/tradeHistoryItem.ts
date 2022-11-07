// toDo: перенести в types???
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import { PositionActionType } from 'modules/terminal/types/positionAction';

export interface TradeHistoryItem  {
    coinSymbol: CoinSymbolProps;
    date: Date;
    action: PositionActionType;
    amount: number;
    price: number;
    PNL: number;
}
