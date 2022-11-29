import styles from './investorWallet.module.scss';
import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useEffect, useState } from 'react';
import { useModal } from 'lib/hooks/useModal';
import TransferModal from 'modules/Payments/Transfer/transferModal';
import { AppLinksEnum } from 'routes/appLinks';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import LineChart from 'modules/Global/components/lineChart/lineChart';
import Chart from 'modules/Global/components/lightChart/chart';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { getRoeAndPnl } from 'store/action-creators/roepnl';
import { getInvestInfo } from 'services/user';
import { getWallets } from 'store/action-creators/wallet';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';

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
    const dispath = useAppDispatch();
    const { dates, pnl, roe, loading } = useTypedSelector(state => state.roePnl);
    const { investWallet, loading: walletsLoading } = useTypedSelector(state => state.wallet);

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
        dispath(getRoeAndPnl());
        getInvestInfo()
            .then(res => {
                setInvestInfo({
                    startTime : new Date(res.data.startSessionTime),
                    pnl : res.data.pnl || 0,
                    roe : res.data.roe || 0,
                    balance : res.data.balance || 0,
                });
            });
        dispath(getWallets());
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
                        {
                            walletsLoading ?
                                <Skeleton 
                                    height={'24px'}
                                    width={'40%'}
                                /> :
                                `${Number(investWallet + investInfo.balance).toFixed(2)} USDT`
                        }
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
                                    value: investWallet,
                                },
                            ]}
                            loading={walletsLoading}
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
                    type={'ROE'}
                    className={styles['chart']}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default InvestorWallet;
