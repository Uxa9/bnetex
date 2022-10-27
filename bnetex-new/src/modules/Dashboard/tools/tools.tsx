import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import styles from './tools.module.scss';
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';

import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import { useUser } from '../dashboard';
import AreaChart from 'modules/terminal/investor/chart/areaChart';
import getRoE from 'services/getroe';
import getPnL from 'services/getpnl';
import TransactionTable from './transactionTable';
import getUserTransactions from 'services/getUserTransactions';

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

    const [roe, setRoe] = useState<GraphicProps>({
        dates: [],
        values: []
    });

    const [pnl, setPnl] = useState<GraphicProps>({
        dates: [],
        values: []
    });

    const [rows, setRows] = useState<RowData[]>([]);

    useEffect(() => {
        getRoE(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(res => {
                setRoe({
                    dates: res.dates,
                    values: res.values.map((item: any) => Number(Number(item).toFixed(2)))
                });
            });
        getPnL(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(res => {
                setPnl({
                    dates: res.dates,
                    values: res.values.map((item: any) => Number(Number(item).toFixed(2)))
                });
            });
        getUserTransactions(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(res => {
                let data = res.map((item: any) => {                    
                    return ({
                        currency : 'usdt',
                        date : new Date(item.createdAt),
                        type : item.type == 1 ? "withdraw" : "deposit",
                        amount : item.amount
                    })
                })

                setRows(data);
            });
    }, []);

    return(
        <div 
            className={styles['tools']}
        >
            <div
                className={styles['tools-header']}
            >
                <h3>
                    Панель инструментов
                </h3>
                <div
                    className={styles['tools-header-buttons']}
                >
                    <Button
                        buttonStyle={'primary'}
                        text={'Ввод'}
                        onClick={() => goToState(AppLinksEnum.DEPOSIT)}
                    />
                    <Button
                        buttonStyle={'outlined'}
                        text={'Вывод'}
                        onClick={() => goToState(AppLinksEnum.WITHDRAW)}
                    />
                </div>
            </div>
            <div
                className={classNames(styles['balance-and-transactions'], 'card')}
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
                        {/* {`${Number(mainWallet + investWallet).toFixed(2)} USDT`} */}
                    </p>
                    <div>
                        {/* <Chart
                            type='bar'
                            series={[
                                {
                                    name: 'Основной кошелек',
                                    data: [Number(Number(mainWallet).toFixed(2))],
                                },
                                {
                                    name: 'Инвестиционный кошелек',
                                    data: [Number(Number(investWallet).toFixed(2))],
                                },
                            ]}
                            height={'150px'}
                            width={'110%'}
                            options={{ // приготовьтесь охуеть
                                chart: {
                                    stacked: true,
                                    zoom      : { enabled : false },
                                    selection : { enabled : false },
                                    toolbar   : { show : false },
                                },
                                grid: { 
                                    show: false,
                                    xaxis: {
                                        lines: { show: false },
                                    },   
                                    yaxis: {
                                        lines: { show: false },
                                    },    
                                },
                                plotOptions: {
                                    bar: {
                                        horizontal: true,
                                        barHeight: '12px',
                                    },
                                },
                                xaxis: {
                                    categories: [''],
                                    labels: {
                                        show: false,
                                    },
                                    axisBorder: { show : false },
                                    axisTicks: { show : false },
                                },
                                yaxis: {
                                    show: false,
                                },
                                stroke: {
                                    width: 0,
                                },
                                legend: {
                                    showForNullSeries: false,
                                    showForSingleSeries: false,
                                    offsetY: -10,
                                    offsetX: -7,
                                    horizontalAlign: 'left'
                                },
                                colors : ['#9202FF', '#1A75FF'],
                                dataLabels : { enabled : false },
                            }}
                        /> */}
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
                            onClick={() => goToState('/dashboard/transactions')}
                        >
                            Посмотреть все
                        </span>
                    </p>
                    <div
                        className={styles['transaction-table-wrapper']}
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
                    <AreaChart
                        dates={pnl.dates}
                        values={pnl.values}
                        title="PnL"
                    />
                </div>
                <div
                    className={classNames(styles['chart'], 'card')}
                >
                    <AreaChart                    
                        dates={roe.dates}
                        values={roe.values}
                        title="RoE"
                    />
                </div>
            </div>
        </div>
    );
};

export default Tools;
