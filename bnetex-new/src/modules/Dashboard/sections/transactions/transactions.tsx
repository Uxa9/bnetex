import { USDT } from 'assets/images/icons';
import clsx from 'clsx';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Transaction, TransactionStatusMap } from 'lib/types/transaction';
import { formatDate } from 'lib/utils/formatDate';
import { useEffect, useState } from 'react';
import getUserTransactions from 'services/getUserTransactions';
import { getTransactions } from 'store/action-creators/transactions';
import CryptoTransactionItem from '../../components/cryptoTransactionItem/cryptoTransactionItem';
import styles from './transactions.module.scss';

const Transactions = () => {

    const dispatch = useAppDispatch();
    const { loading, transactions } = useTypedSelector(state => state.transactions);

    useEffect(() => {
        dispatch(getTransactions());
    }, []);

    return (
        <div className={styles.transactions}>
            <h3>Транзакции</h3>
            <table className={clsx(styles['transactions-table'], 'card')}>
                <thead>
                    <tr className={clsx(styles['transactions-table__row'],
                        styles['transactions-table__header-row'],
                        'caption',
                    )}
                    >
                        <th>Время</th>
                        <th>Перевод</th>
                        <th>Кошелек для вывода</th>
                        <th>Актив</th>
                        <th>Сумма</th>
                        <th>Адресат</th>
                        <th>Статус</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions.map((transaction: Transaction, index: number) => {
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
    );
};

export default Transactions;
