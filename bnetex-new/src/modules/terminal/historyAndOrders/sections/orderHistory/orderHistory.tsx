import classNames from 'classnames';
import CoinSymbol from 'modules/terminal/components/coinSymbol/coinSymbol';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import styles from './orderHistory.module.scss';
import { formatDate } from 'lib/utils/formatDate';
import PositionAction from 'modules/terminal/components/positionAction/positionAction';
import { PositionActionType } from 'modules/terminal/types/positionAction';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import React, { useEffect } from 'react';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';

export interface OrderHistoryItem  {
    coinSymbol: CoinSymbolProps;
    date: Date;
    action: PositionActionType;
    amount: number;
    price: number;
    PNL: number;
}

const OrderHistory = () => {
    const { loading, error, tradeHistory } = useTypedSelector(state => state.tradeHistory);

    return(
        <table className={styles['order-history']}>
            <thead>
                <tr className={'caption'}>
                    <th>Символ</th>
                    <th>Время сделки</th>
                    <th>Действие</th>
                    <th>Объем</th>
                    <th>Цена</th>
                    <th>PNL</th>
                </tr>
            </thead>
            <tbody>
                {
                    loading ? 
                        <tr>
                            <td>
                                <Skeleton height={'8px'} />
                            </td>
                            <td>
                                <Skeleton height={'8px'} />
                            </td>
                            <td>
                                <Skeleton height={'8px'} />
                            </td>
                            <td>
                                <Skeleton height={'8px'} />
                            </td>
                            <td>
                                <Skeleton height={'8px'} />
                            </td>
                            <td>
                                <Skeleton height={'8px'} />
                            </td>
                        </tr> 
                        :
                        tradeHistory.map((position: OrderHistoryItem, index: number) => 
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
                                        {...{
                                            firstCoin: 'BTC',
                                            secondCoin: 'USDT',
                                            lever: 10,
                                            type: 'Бессрочные',
                                        }}
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
                                        value={Number(Number(position.PNL).toFixed(6))}
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
