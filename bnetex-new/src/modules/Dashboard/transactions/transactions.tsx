import classNames from 'classnames';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { CryptoTransactionItemType } from 'lib/types/cryptoTransactionItem';
import { useEffect } from 'react';
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
        type: 'withdrawal',
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

    useEffect(() => {
        loadTrasactions();
    }, []);

    const loadTrasactions = async () => {
        await promiseWithLoading(getTransactions())
            .then((response) => console.log(response))
            .catch((error) => console.log(error));
    };

    return(
        <div className={styles.transactions}>
            <h3>Транзакции</h3>
            <table className={classNames(styles['transactions-table'], 'card')}>
                <thead>
                    <tr className={classNames(styles['transactions-table__row'],
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
                        blankTransactions.map((transaction: CryptoTransactionItemType, index: number) => {
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
