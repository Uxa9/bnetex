import { USDT } from 'assets/images/icons';
import classNames from 'classnames';
import styles from './transactionTable.module.scss';


interface RowData {
    currency: string,
    date: Date | string,
    type: string,
    amount: number
}

interface TableData {
    rows: RowData[]
}

const typesLib = {  // хз пока куда это девать
    withdraw: "Отправлено",
    deposit: "Получено"
}

const TransactionTable = (props: TableData) => {
    
    const rowRender = (row: RowData) => {
        
        const renderCurrency = (name: string) => {
            switch (name) {
                case 'usdt':
                    return (
                        <>
                            <USDT />
                            USDT
                        </>
                    )
                    default:
                        return (
                            <>
                            {name}
                        </>
                    );
            }
        }
        
        const renderDate = (date: Date | string) => {
            if (typeof date === 'object') {
                return (
                    <>
                        {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}
                    </>
                )
            } else {
                return (
                    <>
                        {date}
                    </>
                )
            }
        }
        
        type RowKey = keyof typeof typesLib;
        const type = row.type as RowKey;
        
        return (
            <div
                className={styles['table-row']}
            >
                <div
                    className={styles['currency-wrapper']}
                >
                    {renderCurrency(row.currency)}
                </div>
                <div
                    className={styles['date']}
                >
                    {renderDate(row.date)}
                </div>
                <div
                    className={classNames(styles[`status-${row.type}`], 'status')}
                >
                    {typesLib[type]}
                </div>
                <div
                    className={styles['amount']}
                >
                    {row.amount.toFixed(2)}
                </div>
            </div>
        )
    }

    return (
        <div
            className={styles['transaction-table-container']}
        >
            {props.rows.map(row => rowRender(row))}
        </div>
    )
}

export default TransactionTable;