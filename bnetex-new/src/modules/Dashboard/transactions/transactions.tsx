import classNames from 'classnames';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { CryptoTransactionItemType } from 'lib/types/cryptoTransactionItem';
import { useEffect, useState } from 'react';
import getUserTransactions from 'services/getUserTransactions';
import { getTransactions } from 'services/transactions';
import CryptoTransactionItem from './cryptoTransactionItem/cryptoTransactionItem';
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

    const loadTrasactions =  () => {
        getUserTransactions(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(res => {
                let data = res.map((item: any) => {
                    console.log(item.type);
                    
                    return ({
                        date : new Date(item.createdAt),
                        type : item.type == 1 ? "withdraw" : "deposit",
                        wallet: "Основной кошелек",
                        coin : 'USDT',
                        amount : item.amount,
                        destination: item.walletAddress,
                        status: item.fulfilled ? "confirmed" : "processing"
                    })
                })

                setRows(data);
            });
    };

    return(
        <div className={styles.transactions}>
            <h3>Транзакции</h3>
            <table className={classNames(styles['transactions-table'], 'card')}>
                <thead>
                    <tr className={classNames(styles['transactions-table__row'],
                        styles['transactions-table__header-row']
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
                            return(
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
        </div>
    );
};

export default Transactions;
