import styles from './investorWallet.module.scss';
import classNames from 'classnames';
import AreaChart from 'modules/terminal/investor/chart/areaChart';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useEffect, useState } from 'react';
import { useModal } from 'lib/hooks/useModal';
import TransferModal from 'modules/Payments/Transfer/transferModal';
import getRoE from 'services/getroe';
import getPnL from 'services/getpnl';
import Chart from 'react-apexcharts';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import useWalletActions from 'services/walletActions';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import { useTheme } from 'lib/hooks/useTheme';

// toDo
// сделать нормальные кнопки

interface GraphicProps {
    dates: string[],
    values: number[]
}


const InvestorWallet = () => {

    const { goToState } = useGoToState();
    const { open: OpenTransferModal } = useModal(TransferModal);
    const [mainBalance, setMainBalance] = useState<number>(0);
    const [investBalance, setInvestBalance] = useState<number>(0);
    const { promiseWithLoading } = usePromiseWithLoading();
    const { getWallets } = useWalletActions();
    const { theme } = useTheme();

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
        promiseWithLoading<WalletCategoryWithBalance>(getWallets())
            .then(res => {
                setMainBalance(res.main);
                setInvestBalance(res.investor);
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
                        onClick={() => OpenTransferModal({})}
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
                        {`${Number(investBalance).toFixed(2)} USDT`}
                    </p>
                    <div>
                        <Chart
                            type='bar'
                            series={[
                                {
                                    name: "В работе",
                                    data: [Number(Number(mainBalance).toFixed(2))]
                                },
                                {
                                    name: "Доступно для вывода",
                                    data: [Number(Number(investBalance).toFixed(2))]
                                }
                            ]}
                            height={'150px'}
                            width={'100%'}
                            options={{ // приготовьтесь охуеть
                                chart: {
                                    stacked: true,
                                    zoom: { enabled: false },
                                    selection: { enabled: false },
                                    toolbar: { show: false },
                                    offsetY: -60,
                                    offsetX: -25,
                                    background: 'transparent'
                                },
                                theme: {
                                    mode: theme,
                                    monochrome: {
                                        enabled: false
                                    }
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
