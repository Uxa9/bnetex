import clsx from 'clsx';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Transaction } from 'lib/types/transaction';
import TableSkeletonRows from 'modules/terminal/components/tableSkeletorRows/tableSkeletonRows';
import { useEffect } from 'react';
import { getTransactions } from 'store/action-creators/transactions';
import CryptoTransactionItem from '../../components/cryptoTransactionItem/cryptoTransactionItem';
import styles from './transactions.module.scss';

const TABLE_COLUMNS = 7;

const Transactions = () => {

    const dispatch = useAppDispatch();
    const { loading, transactions } = useTypedSelector(state => state.transactions);

    useEffect(() => {
        dispatch(getTransactions());
    }, []);

    return (
        <div className={styles.transactions}>
            <h3>Транзакции</h3>
            <div className={styles['transactions-table__wrapper']}>
                <table className={styles['transactions-table']}>
                    <thead>
                        <tr className={clsx(
                            styles['transactions-table__row'],
                            'caption',
                        )}
                        >
                            <th>Время</th>
                            <th>Перевод</th>
                            <th>Кошелек</th>
                            <th>Актив</th>
                            <th>Сумма</th>
                            <th>Адресат</th>
                            <th>Статус</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                <TableSkeletonRows
                                    columnCount={TABLE_COLUMNS}
                                    skeletonClassname={styles['skeleton']}
                                />
                                :
                                transactions.map((transaction: Transaction) => {
                                    return (
                                        <tr
                                            className={styles['transactions-table__row']}
                                            key={transaction.id}
                                        >
                                            <CryptoTransactionItem
                                                item={transaction}
                                            />
                                        </tr>
                                    );
                                })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
