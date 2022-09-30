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

const Tools = () => {

    const { goToState } = useGoToState();

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
                <p>
                    Панель инструментов
                </p>
                <div
                    className={styles['tools-header-buttons']}
                >
                    <Button
                        buttonStyle={'primary'}
                        text={'Ввод'}
                        onClick={() => goToState(AppLinksEnum.DEPOSIT)}
                    />
                    <Button
                        buttonStyle={'secondary'}
                        text={'Вывод'}
                    />
                    <span>Купить криптовалюту</span>
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
                </div>
            </div>
            <div
                className={styles['charts']}
            >
                <div
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

                </div>
            </div>
        </div>
    );
};

export default Tools;
