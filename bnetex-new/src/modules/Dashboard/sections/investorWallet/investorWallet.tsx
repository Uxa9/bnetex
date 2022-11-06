import styles from './investorWallet.module.scss';
import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useEffect, useState } from 'react';
import { useModal } from 'lib/hooks/useModal';
import TransferModal from 'modules/Payments/Transfer/transferModal';
import Chart from 'react-apexcharts';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import useWalletActions from 'services/walletActions';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import { useTheme } from 'lib/hooks/useTheme';
import { AppLinksEnum } from 'routes/appLinks';
import InvestorChart from 'modules/Global/components/investorChart/investorChart';
import { getInvestInfo, getRoeAndPnl } from 'services/user';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';

// toDo
// сделать нормальные кнопки

interface GraphicProps {
    dates: string[],
    values: number[]
}

interface InvestInfoProps {
    balance : number,
    startTime : Date,
    pnl : number,
    roe : number
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
        values: [],
    });

    const [pnl, setPnl] = useState<GraphicProps>({
        dates: [],
        values: [],
    });

    const [investInfo, setInvestInfo] = useState<InvestInfoProps>({
        balance : 0,
        startTime : new Date(),
        pnl : 0,
        roe : 0
    });

    const renderTime = () => {

        const diff = new Date().getTime() - investInfo.startTime.getTime() || 0;
        const hours = diff / 3600000;
        const days  = hours / 24;

        if ( days < 1 ) {
            return `${Number(hours).toFixed(0)} час`;
        } else {
            return `${Number(days).toFixed(0)} дней ${Number(hours - Math.floor(days) * 24).toFixed(0)} час`;
        }
    }

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
        getInvestInfo()
            .then(res => {
                setInvestInfo({
                    startTime : new Date(res.data.startSessionTime),
                    pnl : res.data.pnl || 0,
                    roe : res.data.roe || 0,
                    balance : res.data.balance || 0
                })
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
                        {`${Number(investBalance + investInfo.balance).toFixed(2)} USDT`}
                    </p>
                    <div>
                        {/* toDo: убрать нахуй это говно */}
                        <Chart
                            type='bar'
                            series={[
                                {
                                    name: 'В работе',
                                    data: [Number(Number(investInfo.balance).toFixed(2))],
                                },
                                {
                                    name: 'Доступно для вывода',
                                    data: [Number(Number(investBalance).toFixed(2))],
                                },
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
                                        lines: { show: false },
                                    },
                                    yaxis: {
                                        lines: { show: false },
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
                                        show: false,
                                    },
                                    axisBorder: { show: false },
                                    axisTicks: { show: false },
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
                                    horizontalAlign: 'left',
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
                            {investInfo.balance}
                        </span>
                    </p>
                    <p>
                        <span>
                            Время работы
                        </span>
                        <span>
                            {renderTime()}
                        </span>
                    </p>
                    <p>
                        <span>
                            PNL
                        </span>
                        <SignedNumber
                            value={investInfo.pnl}
                            postfix={""}
                        />
                    </p>
                    <p>
                        <span>
                            ROE
                        </span>
                        <SignedNumber
                            value={investInfo.roe}
                            postfix={"%"}
                        />
                    </p>
                    <Button
                        buttonStyle='primary'
                        text='Перейти в терминал'
                        onClick={() => goToState(`${AppLinksEnum.TERMINAL}/investor`)}
                    />
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

export default InvestorWallet;
