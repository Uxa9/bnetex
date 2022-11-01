import classNames from 'classnames';
import CoinSymbol from 'modules/terminal/components/coinSymbol/coinSymbol';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import { mockedOrderHistory } from './mock';
import styles from './orderHistory.module.scss';
import { formatDate } from 'lib/utils/formatDate';
import PositionAction from 'modules/terminal/components/positionAction/positionAction';
import { PositionActionType } from 'modules/terminal/types/positionAction';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';

export interface OrderHistoryItem  {
    coinSymbol: CoinSymbolProps;
    date: Date;
    action: PositionActionType;
    type: string;
    amount: number;
    price: number;
    fee: number;
    PNL: number;
}

const OrderHistory = () => {
    return(
        <table className={styles['order-history']}>
            <thead>
                <tr className={'caption'}>
                    <th>Символ</th>
                    <th>Время сделки</th>
                    <th>Действие</th>
                    <th>Тип</th>
                    <th>Объем</th>
                    <th>Цена</th>
                    <th>Комиссия</th>
                    <th>PNL</th>
                </tr>
            </thead>
            <tbody>
                {
                    mockedOrderHistory.map((position: OrderHistoryItem, index: number) => 
                        <tr 
                            className={'text'}
                            key={index}
                        >
                            <td className={styles['coin-symbol']}>
                                <span 
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Символ
                                </span>
                                <CoinSymbol 
                                    {...position.coinSymbol}
                                />
                            </td>
                            <td className={styles['time']}>
                                <span 
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Время сделки
                                </span>
                                {formatDate(position.date, true)}
                            </td>
                            <td className={styles['action']}>
                                <span
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Действие
                                </span>
                                <PositionAction 
                                    action={position.action}
                                />
                            </td>
                            <td className={styles['type']}> 
                                <span className={classNames(
                                    styles['body-label'],
                                    'caption',
                                )}
                                >
                                    Тип
                                </span>
                                {position.type} 
                            </td>
                            <td className={styles['amount']}>
                                <span 
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Объем
                                </span>
                                {position.amount}
                            </td>
                            <td className={styles['price']}> 
                                <span 
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Цена
                                </span>
                                {position.price}
                            </td>
                            <td className={styles['fee']}> 
                                <span 
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Комиссия
                                </span>
                                {position.fee}
                            </td>
                            <td className={styles['PNL']}> 
                                <span 
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    PNL
                                </span>
                                <SignedNumber 
                                    value={position.PNL}
                                />
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
};

export default OrderHistory;
