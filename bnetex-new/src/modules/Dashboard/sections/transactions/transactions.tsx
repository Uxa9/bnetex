import { USDT } from 'assets/images/icons';
import clsx from 'clsx';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { CryptoTransactionItemStatusMap, CryptoTransactionItemType } from 'lib/types/cryptoTransactionItem';
import { formatDate } from 'lib/utils/formatDate';
import { useEffect, useState } from 'react';
import getUserTransactions from 'services/getUserTransactions';
import { getTransactions } from 'services/transactions';
import CryptoTransactionItem from '../../components/cryptoTransactionItem/cryptoTransactionItem';
import styles from './transactions.module.scss';

const blankTransactions: CryptoTransactionItemType[] = [
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'withdraw',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 130.56,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'processing',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'unpayed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
    {
        date: new Date(),
        type: 'income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'confirmed',
    },
];

const Transactions = () => {

    const { promiseWithLoading, isLoading } = usePromiseWithLoading();
    const [rows, setRows] = useState<CryptoTransactionItemType[]>([]);

    useEffect(() => {
        loadTrasactions();
    }, []);

    const loadTrasactions = () => {
        getUserTransactions(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(res => {
                let data = res.map((item: any) => {
                    console.log(item.type);

                    return ({
                        date: new Date(item.createdAt),
                        type: item.type.toString() == "1" ? "withdraw" : "income",
                        wallet: "Основной кошелек",
                        coin: 'USDT',
                        amount: item.amount,
                        destination: item.walletAddress,
                        status: item.fulfilled ? "confirmed" : "processing"
                    })
                })

                setRows(data);
            });
    };

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
                        rows.map((transaction: CryptoTransactionItemType, index: number) => {
                            return (
                                <tr
                                    className={styles['transactions-table__row']}
                                    key={index}
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
            <div
                className={clsx(styles["mobile-table"], 'card')}
            >
                {
                    rows.map((transaction: CryptoTransactionItemType) => {
                        return (
                            <div
                                className={styles['transaction-item']}
                            >
                                <div
                                    className={styles['item-first-row']}
                                >
                                    <div
                                        className={styles['item-type-amount-coin']}
                                    >
                                        <span
                                            className={clsx(styles['item-type'],
                                                styles[`item-type--${transaction.type}`],
                                                'caption',
                                            )}
                                        >
                                            {transaction.type === 'income' ? 'Ввод' : 'Вывод'}
                                        </span>
                                        <span>
                                            {transaction.amount} USDT
                                        </span>
                                        <div>
                                            <USDT />
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(styles['item-status'],
                                            styles[`item-status--${transaction.status}`],
                                            'caption-mini',
                                        )}
                                    >
                                        {CryptoTransactionItemStatusMap[transaction.status]}
                                    </div>
                                </div>
                                <div
                                    className={styles['item-second-row']}
                                >
                                    <div
                                        className={styles['item-date']}
                                    >
                                        <span>
                                            {formatDate(transaction.date, true)}
                                        </span>
                                    </div>
                                    <div
                                        className={styles['item-wallet']}
                                    >
                                        {transaction.wallet}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default Transactions;
