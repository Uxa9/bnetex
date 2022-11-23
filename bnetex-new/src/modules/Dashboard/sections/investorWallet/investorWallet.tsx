import styles from './investorWallet.module.scss';
import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useEffect, useState } from 'react';
import { useModal } from 'lib/hooks/useModal';
import TransferModal from 'modules/Payments/Transfer/transferModal';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import useWalletActions from 'services/walletActions';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import { AppLinksEnum } from 'routes/appLinks';
import { getInvestInfo, getRoeAndPnl } from 'services/user';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import LineChart from 'modules/Global/components/lineChart/lineChart';
import Chart from 'modules/Global/components/lightChart/chart';

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

//toDo: почистить компонент, выделить баланс и прочую хуйню в стор
const InvestorWallet = () => {

    const { goToState } = useGoToState();
    const { open: OpenTransferModal } = useModal(TransferModal);
    const [mainBalance, setMainBalance] = useState<number>(0);
    const [investBalance, setInvestBalance] = useState<number>(0);
    const { promiseWithLoading } = usePromiseWithLoading();
    const { getWallets } = useWalletActions();

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
        roe : 0,
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
    };

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
                    balance : res.data.balance || 0,
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
                    className={clsx(styles['balance'], 'card')}
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
                        <LineChart 
                            values={[
                                {
                                    name: 'В работе',
                                    value: investInfo.balance,
                                },
                                {
                                    name: 'Доступно для вывода',
                                    value: investBalance,
                                },
                            ]}
                        />
                    </div>
                </div>
                <div
                    className={clsx(styles['invest-info'], 'card', 'text')}
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
                            postfix={''}
                        />
                    </p>
                    <p>
                        <span>
                            ROE
                        </span>
                        <SignedNumber
                            value={investInfo.roe}
                            postfix={'%'}
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
                <Chart 
                    data={
                        pnl.dates.map((date, index) => {
                            return {
                                time: date,
                                value: pnl.values[index],
                            };
                        })
                    }
                    type={'PNL'}
                    className={styles['chart']}
                />
                <Chart 
                    data={
                        roe.dates.map((date, index) => {
                            return {
                                time: date,
                                value: roe.values[index],
                            };
                        })
                    }
                    type={'ROE'}
                    className={styles['chart']}
                />
            </div>
        </div>
    );
};

export default InvestorWallet;
