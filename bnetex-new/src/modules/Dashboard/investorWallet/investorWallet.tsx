import styles from './investorWallet.module.scss';
import classNames from 'classnames';
import AreaChart from 'modules/terminal/investor/chart/areaChart';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useUser } from '../dashboard';
import { useEffect, useState } from 'react';
import getRoE from 'services/getroe';
import getPnL from 'services/getpnl';
import Chart from 'react-apexcharts';
import { AppLinksEnum } from 'routes/appLinks';

// toDo
// сделать нормальные кнопки

interface GraphicProps {
    dates: string[],
    values: number[]
}

const InvestorWallet = () => {

    const values: number[] = [124.55, 431.42, 324.54, 432.43, 543.76];

    const balance = JSON.parse(localStorage.getItem('investWallet') || '{}') || 0.00;
    const { goToState } = useGoToState();
    const { mainWallet, investWallet } = useUser();

    const [roe, setRoe] = useState<GraphicProps>({
        dates: [],
        values: []
    });

    const [pnl, setPnl] = useState<GraphicProps>({
        dates: [],
        values: []
    });

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
    }, []);

    return (
        <div>
            <div
                className={styles['wallet-header']}
            >
                <h3>
                    Инвестиционный кошелек
                </h3>
                <div
                    className={styles['tools-header-buttons']}
                >
                    <span
                        className={styles['header-transfer']} 
                        onClick={() => goToState(AppLinksEnum.TRANSFER)}
                    >
                        Перевод
                    </span>
                </div>
            </div>
            <div
                className={styles['balance-and-info']}
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
                        {`${Number(investWallet).toFixed(2)} USDT`}
                    </p>
                    <div>
                        <Chart
                            type='bar'
                            series={[
                                {
                                    name: "В работе",
                                    data: [Number(Number(mainWallet).toFixed(2))]
                                },
                                {
                                    name: "Доступно для вывода",
                                    data: [Number(Number(investWallet).toFixed(2))]
                                }
                            ]}
                            height={'150px'}
                            width={'110%'}
                            options={{ // приготовьтесь охуеть
                                chart: {
                                    stacked: true,
                                    zoom: { enabled: false },
                                    selection: { enabled: false },
                                    toolbar: { show: false },
                                    offsetY: -60,
                                    offsetX: -25,
                                },
                                grid: {
                                    show: false,
                                    xaxis: {
                                        lines: { show: false }
                                    },
                                    yaxis: {
                                        lines: { show: false }
                                    },
                                },
                                plotOptions: {
                                    bar: {
                                        horizontal: true,
                                        barHeight: '18px',
                                        borderRadius: 4,
                                    },
                                },
                                xaxis: {
                                    categories: [''],
                                    labels: {
                                        show: false
                                    },
                                    axisBorder: { show: false },
                                    axisTicks: { show: false }
                                },
                                yaxis: {
                                    show: false
                                },
                                stroke: {
                                    width: 0
                                },
                                legend: {
                                    showForNullSeries: false,
                                    showForSingleSeries: false,
                                    offsetY: -10,
                                    offsetX: -7,
                                    horizontalAlign: 'left'
                                },
                                colors: ['#9202FF', '#1A75FF'],
                                dataLabels: { enabled: false },
                            }}
                        />
                    </div>
                </div>
                <div
                    className={classNames(styles['invest-info'], 'card')}
                >
                    <p>
                        <span>
                            В работе
                        </span>
                        <span>
                            1244.55
                        </span>
                    </p>
                    <p>
                        <span>
                            Время работы
                        </span>
                        <span>
                            3 дня 2 часа
                        </span>
                    </p>
                    <p>
                        <span>
                            PNL
                        </span>
                        <span className={styles['positive']}>
                            +322.28 USDT
                        </span>
                    </p>
                    <p>
                        <span>
                            ROE
                        </span>
                        <span className={styles['negative']}>
                            - 2.28%
                        </span>
                    </p>
                    <Button
                        buttonStyle='primary'
                        text='Перейти в терминал'
                        onClick={() => goToState('/terminal/investor')}
                    />
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

export default InvestorWallet;
