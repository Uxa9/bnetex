import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import styles from './tools.module.scss';

import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';

import hehe__roe from '../../../assets/images/hehe__roe.svg';
import hehe__pnl from '../../../assets/images/hehe__pnl.svg';
import hehe__verify from '../../../assets/images/hehe__verify.svg';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import { useUser } from '../dashboard';
import AreaChart from 'modules/terminal/investor/chart/areaChart';
import getRoE from 'services/getroe';
import getPnL from 'services/getpnl';

interface GraphicProps {
    dates: string[],
    values: number[]
}

const Tools = () => {

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

    useEffect(() => {
        console.log(roe);
        console.log(pnl);        
    }, [roe, pnl])

    const values: number[] = [124.55, 431.42, 324.54, 432.43, 543.76];

    const [options, setOptions] = useState({
        dataLabels: {enabled: false},
        labels: ['Основной аккаунт', 'Фьючерсы USD-M'],
        colors : ['#EA018D', '#5072F7'],
    });

    const [series, setSeries] = useState([80, 20]);

    return(
        <div>
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
                className={styles['balance-and-transactions']}
            >
                <div
                    className={`${styles['balance']} block`}
                >
                    <p
                        className={styles['balance-header']}
                    >
                        Баланс
                    </p>
                    <p
                        className={styles['user-balance']}
                    >
                        {`${Number(mainWallet + investWallet).toFixed(2)} USDT`}
                    </p>
                    <div>
                        <Chart
                            type='bar'
                            series={[
                                {
                                    name: "Основной кошелек",
                                    data: [Number(Number(mainWallet).toFixed(2))]
                                },
                                {
                                    name: "Инвестиционный кошелек",
                                    data: [Number(Number(investWallet).toFixed(2))]
                                }
                            ]}
                            height={'150px'}
                            options={{
                                chart: {
                                    stacked: true,
                                    zoom      : { enabled : false },
                                    selection : { enabled : false },
                                    toolbar   : { show : false }
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
                                        barHeight: '12px',
                                    }
                                },
                                xaxis: {
                                    categories: [''],
                                    labels: {
                                        show: false
                                    },
                                    axisBorder: { show : false },
                                    axisTicks: { show : false }
                                },
                                yaxis: {
                                    show: false
                                },
                                stroke: {
                                    width: 0
                                },
                                colors : ['#9202FF', '#1A75FF'],
                                dataLabels : { enabled : false },
                            }}
                        />
                    </div>
                    {/* <div>
                        <Chart
                            options={options}
                            series={series}
                            type="donut"
                            width="400"
                        />
                    </div> */}
                </div>
                <div
                    className={`${styles['balance']} block`}
                >
                    <span
                        className={styles['balance-header']}
                    >
                        Транзакции
                    </span>
                    <span>
                        Посмотреть все
                    </span>
                </div>
            </div>
            <div
                className={styles['charts']}
            >
                <div
                    className={styles.chart}
                >
                    <AreaChart
                        dates={pnl.dates}
                        values={pnl.values}
                        title="PnL"
                    />
                </div>
                <div
                    className={styles.chart}
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
