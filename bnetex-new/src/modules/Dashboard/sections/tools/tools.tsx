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
import { MiniTransaction } from 'lib/types/transaction';

const Tools = () => {

    const { goToState } = useGoToState();
    const { DEPOSIT, WITHDRAW, DASHBOARD, TRANSACTIONS } = AppLinksEnum;
    const dispath = useAppDispatch();
    const { dates, pnl, roe, loading } = useTypedSelector(state => state.roePnl);
    const { mainWallet, investWallet, loading: walletsLoading } = useTypedSelector(state => state.wallet);

    const [rows, setRows] = useState<MiniTransaction[]>([]);

    useEffect(() => {
        dispath(getRoeAndPnl());
        getUserTransactions()
            .then(res => {
                let data = res.map((item: any) => {
                    return ({
                        coin : 'usdt',
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
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h3>
                    Панель инструментов
                </h3>
                <div className={styles['header__buttons']}>
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
            <div className={styles['cards']}>
                <div className={clsx(styles['balance'], 'card')} >
                    <p className={clsx(styles['card-header'], 'caption')}>
                        Баланс
                    </p>
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
                        valuePostfix={'USDT'}
                        loading={walletsLoading}
                    />
                </div>
                <div className={clsx(styles['transactions'], 'card')}>
                    <div className={styles['transactions__header']}>
                        <span className={clsx(styles['header-balance'], styles['card-header'])}>
                            Транзакции
                        </span>
                        <Button
                            text='Посмотреть все'
                            buttonStyle={'flat'}
                            onClick={() => goToState(`${DASHBOARD}/${TRANSACTIONS}`)}
                            mini
                        />
                    </div>
                    <TransactionTable
                        rows={rows}
                    />
                </div>
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
