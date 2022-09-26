import classNames from 'classnames';
import { CryptoTransactionItemType } from 'lib/types/cryptoTransactionItem';
import CryptoTransactionItem from './cryptoTransactionItem/cryptoTransactionItem';
import styles from './transactions.module.scss';

const blankTransactions: CryptoTransactionItemType[] = [
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Withdrawal',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 130.56,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Processing',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
    {
        date: new Date(),
        type: 'Income',
        wallet: 'Основной кошелек',
        coin: 'USDT',
        amount: 30.2,
        destination: 'TJfgdhyrt7654FD65gFdt67slp654',
        status: 'Confirmed',
    },
];

const Transactions = () => {

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
