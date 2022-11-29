import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import styles from './tools.module.scss';
import { useEffect, useState } from 'react';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import TransactionTable from './transactionTable';
import getUserTransactions from 'services/getUserTransactions';
import LineChart from 'modules/Global/components/lineChart/lineChart';
import Chart from 'modules/Global/components/lightChart/chart';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { getRoeAndPnl } from 'store/action-creators/roepnl';
import { getWallets } from 'store/action-creators/wallet';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';

interface RowData {
    currency: string,
    date: Date | string,
    type: string,
    amount: number
}

//toDo: все переделать к хуям)) В стилях грязь, в tsx выделить стейты в redux store и навести порядок

const Tools = () => {

    const { goToState } = useGoToState();
    const { DEPOSIT, WITHDRAW, DASHBOARD, TRANSACTIONS } = AppLinksEnum;
    const dispath = useAppDispatch();
    const { dates, pnl, roe, loading } = useTypedSelector(state => state.roePnl);
    const { mainWallet, investWallet, loading: walletsLoading } = useTypedSelector(state => state.wallet);

    const [rows, setRows] = useState<RowData[]>([]);

    useEffect(() => {
        dispath(getRoeAndPnl());
        getUserTransactions(getUserInfo().userId ?? 0)
            .then(res => {
                let data = res.map((item: any) => {
                    return ({
                        currency : 'usdt',
                        date : new Date(item.createdAt),
                        type : item.type === '1' ? 'withdraw' : 'deposit',
                        amount : item.amount,
                    });
                });
                setRows(data);
            });
        dispath(getWallets());
    }, []);

    return (
        <div className={styles['tools']}>
            <div className={styles['tools-header']}>
                <h3>
                    Панель инструментов
                </h3>
                <div className={styles['tools-header-buttons']}>
                    <Button
                        buttonStyle={'primary'}
                        text={'Ввод'}
                        onClick={() => goToState(DEPOSIT)}
                    />
                    <Button
                        buttonStyle={'outlined'}
                        text={'Вывод'}
                        onClick={() => goToState(WITHDRAW)}
                    />
                </div>
            </div>
            <div
                className={styles['balance-and-transactions']}
            >
                <div
                    className={clsx(styles['balance'], 'card')}
                >
                    <p
                        className={styles['balance-header']}
                    >
                        Баланс
                    </p>
                    <h6>
                        {
                            walletsLoading ?
                                <Skeleton 
                                    height={'24px'}
                                    width={'40%'}
                                /> :
                                `${mainWallet + investWallet} USDT` 
                        }
                    </h6>
                    <LineChart 
                        values={[
                            {
                                name: 'Основной кошелек',
                                value: mainWallet,
                            },
                            {
                                name: 'Инвестиционный кошелек',
                                value: investWallet,
                            },
                        ]}
                        loading={walletsLoading}
                    />
                </div>
                <div
                    className={clsx(styles['transactions'], 'card')}
                >
                    <p
                        className={styles['transactions-header']}
                    >
                        <span
                            className={styles['header-balance']}
                        >
                            Транзакции
                        </span>
                        <span
                            className={styles['header-show-all']} 
                            onClick={() => goToState(`${DASHBOARD}/${TRANSACTIONS}`)}
                        >
                            Посмотреть все
                        </span>
                    </p>
                    <div
                        className={clsx(styles['transaction-table-wrapper'], 'scroll')}
                    >
                        <TransactionTable
                            rows={rows}
                        />
                    </div>
                </div>
            </div>
            <div
                className={styles['charts']}
            >
                <Chart 
                    data={
                        dates.map((date, index) => {
                            return {
                                time: date,
                                value: pnl[index],
                            };
                        })
                    }
                    type={'PNL'}
                    className={styles['chart']}
                    loading={loading}
                />
                <Chart 
                    data={
                        dates.map((date, index) => {
                            return {
                                time: date,
                                value: roe[index],
                            };
                        })
                    }
                    type={'PNL'}
                    className={styles['chart']}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Tools;
