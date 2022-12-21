import { USDT } from 'assets/images/icons';
import clsx from 'clsx';
import { format } from 'date-fns';
import { MiniTransaction } from 'lib/types/transaction';
import styles from './transactionTable.module.scss';

interface TableData {
    rows: MiniTransaction[]
}

const TransactionTable = ({ rows }: TableData) => {

    if (!rows.length) return (
        <div
            className={clsx(styles['empty-table'], 'text')}
        >
            Список транзакций пуст
        </div>
    );

    return (
        <div className={clsx(styles['table-wrapper'], 'scroll')}>
            <table
                className={styles['table']}
            >
                <tbody>
                    {
                        rows.map((row, key: number) =>
                            <tr
                                className={clsx(styles['table__row'], 'caption-mi')}
                                key={key}
                            >
                                <td
                                    className={styles['currency-wrapper']}
                                >
                                    {   //toDo: сделать нормальный evaluate для разных монет (как??)
                                        row.coin === 'usdt' &&
                                    <USDT
                                        className={styles['currency-logo']}
                                    />
                                    }
                                    { row.coin.toUpperCase() }
                                </td>
                                <td
                                    className={styles['date']}
                                >
                                    {format(row.date, 'dd/MM/yyyy HH:mm')}
                                </td>
                                <td
                                    className={clsx(styles[`status--${row.type}`], styles['status'])}
                                >
                                    { row.type === 'withdraw' ? 'Отправлено' : 'Получено' }
                                </td>
                                <td
                                    className={styles['amount']}
                                >
                                    { row.amount }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
