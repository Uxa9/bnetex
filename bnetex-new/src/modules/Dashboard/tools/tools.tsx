import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import styles from './tools.module.scss';

import Chart from 'react-apexcharts';
import { useState } from 'react';

import hehe__roe from '../../../assets/images/hehe__roe.svg';
import hehe__pnl from '../../../assets/images/hehe__pnl.svg';
import hehe__verify from '../../../assets/images/hehe__verify.svg';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import { useUser } from '../dashboard';

const Tools = () => {

    const { goToState } = useGoToState();
    const { mainWallet, investWallet } = useUser();

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
                        buttonStyle={'primary'}
                        text={'Вывод'}
                        onClick={() => goToState(AppLinksEnum.WITHDRAW)}
                    />
                </div>
            </div>
            <div
                className={styles['balance-and-transactions']}
            >
                {/* <div
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
                        0.0040543 BTC
                        <span>
                            {' ≈ 4 354.31 USDT'}
                        </span>
                    </p>
                    <div>
                        <Chart
                            options={options}
                            series={series}
                            type="donut"
                            width="400"
                        />
                    </div>
                </div>
                <div
                    className={`${styles['transactions']} block`}
                >
                    <div>
                        <span>
                            Транзакции
                        </span>
                        <span>
                            Посмотреть все
                        </span>
                    </div>
                </div> */}
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
            </div>
            <div
                className={styles['charts']}
            >
                {/* <div
                    style={{
                        width: '400px',
                        height: '330px',
                        background: `url(${hehe__roe})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        margin: '0 -40px',
                    }}
                >


                </div>
                <div
                    style={{
                        width: '400px',
                        height: '330px',
                        background: `url(${hehe__pnl})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        margin: '0 -40px',
                    }}
                >
                </div>
                <div
                    style={{
                        width: '400px',
                        height: '330px',
                        background: `url(${hehe__verify})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        margin: '0 -40px',
                    }}
                >
                </div> */}
            </div>
        </div>
    );
};

export default Tools;
