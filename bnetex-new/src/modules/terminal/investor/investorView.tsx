import { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import TradeView from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';
import clsx from 'clsx';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import Chart from 'modules/Global/components/lightChart/chart';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';

type InvestorViewType = 'trade' | 'history';

const InvestorView = () => {

    const [viewType, setViewType] = useState<InvestorViewType>('trade');
    const { dates, roe, pnl, loading } = useTypedSelector(state => state.roePnl);

    return (
        <>
            <div
                className={clsx(styles['investor-view-card'], styles['toggle-section-card'], 'card')}
            >
                <div className={styles['investor-view-wrapper__header']}>
                    <ToggleButtonGroup
                        title={''}
                        name={'investor_terminal'}
                        onChange={(value: InvestorViewType) => {
                            setViewType(value);
                        }}
                        value={viewType}
                    >
                        <ToggleButton
                            text={'Торговля'}
                            value={'trade'}
                        />
                        <ToggleButton
                            text={'История'}
                            value={'history'}
                        />
                    </ToggleButtonGroup>
                    <ToolTip
                        title='Что такое история?'
                        infoText='История или история сделок - это исторические записи фактических транзакций по позициям. 
                        В раздел попадают только исполненные ордера.'
                    />
                </div>
                {
                    viewType === 'trade' ?
                        <TradeView /> :
                        <HistoryView />
                }
            </div>
            <div
                className={clsx(
                    styles['investor-view-card'],
                    styles['data-card'],
                    'card'
                )}
            >
                <ToolTip
                    title='Доход инвестора'
                    infoText='Доход инвестора это PNL алгоритма за вычетом комиссии BNETEX (50%), от суммы переданной алгоритму.'
                />
                <div
                    className={styles['data-card__row']}
                >
                    {
                        viewType === "trade" ?
                            <>
                                <span
                                    className={'subtitle'}
                                >
<<<<<<< Updated upstream
                                    0
                                </span>
                                <SignedNumber
                                    value={0}
=======
                                    {userTradeInfo?.userPnl?.toFixed(2) ?? '0.00'}
                                </span>
                                <SignedNumber
                                    value={userTradeInfo?.userRoe?.toFixed(2) || 0}
>>>>>>> Stashed changes
                                    postfix={'%'}
                                />
                            </> :
                            <>
                                <span
                                    className={'subtitle'}
                                >
                                    {pnl.reduce((acc, it) => acc + it, 0)}
                                </span>
                                <SignedNumber
                                    value={roe.at(-1) ?? 0}
                                    postfix={'%'}
                                />
                            </>
                    }
                </div>
            </div>
            <Chart
                data={
                    viewType === "history" ?
                    dates.map((date, index) => {
                        return {
                            time: date,
                            value: pnl[index],
                        };
                    }) :
                    []
                }
                type={'PNL'}
                className={clsx(
                    styles['investor-view-card'],
                    styles['PNL-card'],
                )}
                loading={loading}
            />
            <Chart
                data={
                    viewType === "history" ?
                    dates.map((date, index) => {
                        return {
                            time: date,
                            value: roe[index],
                        };
                    }) : 
                    []
                }
                type={'ROE'}
                className={clsx(
                    styles['investor-view-card'],
                    styles['ROE-card'],
                )}
                loading={loading}
            />
        </>
    );
};

export default InvestorView;
