import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import styles from './tools.module.scss';
import { useEffect, useState } from 'react';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import TransactionTable from './transactionTable';
import getUserTransactions from 'services/getUserTransactions';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import useWalletActions from 'services/walletActions';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import InvestorChart from 'modules/Global/components/investorChart/investorChart';
import { getRoeAndPnl } from 'services/user';
import LineChart from 'modules/Global/components/lineChart/lineChart';

interface GraphicProps {
    dates: string[],
    values: number[]
}

interface RowData {
    currency: string,
    date: Date | string,
    type: string,
    amount: number
}

const Tools = () => {

    const { goToState } = useGoToState();
    const [mainBalance, setMainBalance] = useState<number>(0);
    const [investBalance, setInvestBalance] = useState<number>(0);
    const { promiseWithLoading } = usePromiseWithLoading();
    const { getWallets } = useWalletActions();
    const { DEPOSIT, WITHDRAW, DASHBOARD, TRANSACTIONS } = AppLinksEnum;

    const [roe, setRoe] = useState<GraphicProps>({
        dates: [],
        values: [],
    });

    const [pnl, setPnl] = useState<GraphicProps>({
        dates: [],
        values: [],
    });

    const [rows, setRows] = useState<RowData[]>([]);

    useEffect(() => {
        getRoeAndPnl()
            .then(res => {
                setRoe({
                    dates: res.data.dates,
                    values: res.data.roe.map((item: any) => Number(Number(item).toFixed(2))),
                });
                setPnl({
                    dates: res.data.dates,
                    values: res.data.pnl.map((item: any) => Number(Number(item).toFixed(2))),
                });
            });
        getUserTransactions(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(res => {
                let data = res.map((item: any) => {
                    return ({
                        currency : 'usdt',
                        date : new Date(item.createdAt),
                        type : item.type === 1 ? 'withdraw' : 'deposit',
                        amount : item.amount,
                    });
                });

                setRows(data);
            });
        promiseWithLoading<WalletCategoryWithBalance>(getWallets())
            .then(res => {
                setMainBalance(res.main);
                setInvestBalance(res.investor);
            });
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
                    className={classNames(styles['balance'], 'card')}
                >
                    <p
                        className={styles['balance-header']}
                    >
                        Баланс
                    </p>
                    <p
                        className={styles['user-balance']}
                    >
                        {`${Number(mainBalance + investBalance).toFixed(2)} USDT`}
                    </p>
                    <div
                        className={styles['chart-wrapper']}
                    >
                        <LineChart 
                            values={[
                                {
                                    name: 'Основной кошелек',
                                    value: mainBalance,
                                },
                                {
                                    name: 'Инвестиционный кошелек',
                                    value: investBalance,
                                },
                            ]}
                        />
                    </div>
                </div>
                <div
                    className={classNames(styles['transactions'], 'card')}
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
                        className={classNames(styles['transaction-table-wrapper'], 'scroll')}
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
                <div
                    className={classNames(styles['chart'], 'card')}
                >
                    <InvestorChart 
                        dates={pnl.dates}
                        values={pnl.values}
                        type={'PNL'}
                    />
                </div>
                <div
                    className={classNames(styles['chart'], 'card')}
                >
                    <InvestorChart 
                        dates={roe.dates}
                        values={roe.values}
                        type={'ROE'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Tools;
