import classNames from 'classnames';
import CoinSymbol from 'modules/terminal/components/coinSymbol/coinSymbol';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import { mockedOpenedOrders } from './mock';
import styles from './openedOrders.module.scss';
import { formatDate } from 'lib/utils/formatDate';

export interface OpenedOrder  {
    coinSymbol: CoinSymbolProps;
    date: Date;
    type: string;
    action: 'purchase' | 'sale';
    amount: number;
    price: number;
}

// toDo сделать максимально просто....

const OpenedOrders = () => {

    const evaluateActionType = (action: OpenedOrder['action']) => {
        return action === 'purchase' ?
            <span className={styles['action--purchase']}>Покупка</span> : 
            <span className={styles['action--sale']}>Продажа</span>;
    };

    return(
        <table className={styles['opened-orders']}>
            <thead>
                <tr className={'caption'}>
                    <th>Символ</th>
                    <th>Время сделки</th>
                    <th>Тип</th>
                    <th>Действие</th>
                    <th>Объем</th>
                    <th>Цена</th>
                </tr>
            </thead>
            <tbody>
                {
                    mockedOpenedOrders.map((position: OpenedOrder, index: number) => 
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
                            <td className={styles['action']}>
                                <span
                                    className={classNames(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                >
                                    Действие
                                </span>
                                {evaluateActionType(position.action)} 
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
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
};

export default OpenedOrders;
