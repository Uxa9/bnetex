import styles from './investorWallet.module.scss';
import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import { useEffect } from 'react';
import { useModal } from 'lib/hooks/useModal';
import TransferModal from 'modules/Payments/Transfer/transferModal';
import LineChart from 'modules/Global/components/lineChart/lineChart';
import Chart from 'modules/Global/components/lightChart/chart';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { getRoeAndPnl } from 'store/action-creators/roepnl';
import { getWallets } from 'store/action-creators/wallet';
import { getAlgotradeData } from 'store/action-creators/algotrade';
import AlgotradeStats from 'modules/Dashboard/components/algotradeStats/algotradeStats';

const InvestorWallet = () => {

    const { open: OpenTransferModal } = useModal(TransferModal);
    const dispatch = useAppDispatch();
    const { dates, pnl, roe, loading } = useTypedSelector(state => state.roePnl);
    const { investWallet, loading: walletsLoading } = useTypedSelector(state => state.wallet);
    const { balance: algotradeBalance } = useTypedSelector(state => state.algotrade);

    useEffect(() => {
        dispatch(getRoeAndPnl());
        dispatch(getAlgotradeData());
        dispatch(getWallets());
    }, []);

    return (
        <div className={styles['container']}>
            <div
                className={styles['header']}
            >
                <h3>
                    Инвестиционный кошелек
                </h3>
                <Button
                    text={'Перевод'}
                    onClick={() => OpenTransferModal({})}
                    buttonStyle={'flat'}
                />
            </div>
            <div
                className={styles['cards']}
            >
                <div
                    className={clsx(styles['balance-card'], 'card')}
                >
                    <p
                        className={clsx(styles['balance-card__label'], 'caption')}
                    >
                        Баланс
                    </p>
                    <LineChart
                        values={[
                            {
                                name: 'В работе',
                                value: algotradeBalance,
                            },
                            {
                                name: 'Доступно для вывода',
                                value: investWallet,
                            },
                        ]}
                        loading={walletsLoading}
                        valuePostfix={'USDT'}
                    />
                </div>
                <AlgotradeStats />
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
