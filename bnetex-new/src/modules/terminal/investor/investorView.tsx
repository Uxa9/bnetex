import { useContext, useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import TradeView from './tradeView/tradeView';
import HistoryView from './historyView/historyView';
import styles from './investorView.module.scss';
import ToolTip from 'lib/ui-kit/toolTip';
import clsx from 'clsx';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import Chart from 'modules/Global/components/lightChart/chart';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { WebsocketContext } from '../../../context/WebsocketContext';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import {changeViewType, triggerTVMarkRefresh} from 'store/action-creators/algotrade';

type InvestorViewType = 'trade' | 'history';

interface tradeSessionInfoInterface {
    margin: any,
    markPrice: number,
    pair: string,
    userPnl: number,
    userRoe: number,
    volume: number
}

//toDo: убрать это блядство с сокетами отсюда
const InvestorView = () => {

    const [viewType, setViewType] = useState<InvestorViewType>('trade');
    const [investorPnl, setInvestorPnl] = useState<Number>(0);
    const [invesotrRoe, setInvestorRoe] = useState<Number>(0);

    const dispatch = useAppDispatch();

    const { dates, roe, pnl, loading } = useTypedSelector(state => state.roePnl);

    const tradeSession = io(`http://localhost:5001?id=${getUserInfo().userId}`);

    tradeSession.on('connect', () => {
        console.log('connected');
    });

    tradeSession.on('currentPosition', (newMessage: any) => {
        console.log(newMessage);
    });

    const socket = useContext(WebsocketContext);
    const [userTradeInfo, setUserTradeInfo] = useState<tradeSessionInfoInterface>();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected!');
        });

        socket.on('currentPosition', (tradeInfo: any) => {
            console.log('onMessage event received!');
            console.log(tradeInfo);
            setUserTradeInfo(tradeInfo);
        });

        return () => {
            console.log('Unregistering Events...');
            socket.off('connect');
            socket.off('onMessage');
        };
    }, []);

    const handleViewTypeChange = (value: InvestorViewType) => {
        if (viewType === 'history' && value === 'trade') {
            localStorage.setItem('history', '0');
            dispatch(triggerTVMarkRefresh());
        }
        dispatch(changeViewType(value));
        setViewType(value);
    };

    return (
        <>
            <div
                className={clsx(styles['investor-view-card'], styles['toggle-section-card'], 'card')}
            >
                <div className={styles['investor-view-wrapper__header']}>
                    <ToggleButtonGroup
                        title={''}
                        name={'investor_terminal'}
                        onChange={handleViewTypeChange}
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
                        viewType === 'trade' ?
                            <>
                                <span
                                    className={'subtitle'}
                                >
                                    {userTradeInfo?.userPnl.toFixed(2) ?? '0.00'}
                                </span>
                                <SignedNumber
                                    value={userTradeInfo?.userRoe.toFixed(2) || 0}
                                    postfix={'%'}
                                />
                            </> :
                            <>
                                <span
                                    className={'subtitle'}
                                >
                                    {(pnl.reduce((acc, it) => acc + it, 0) / 2).toFixed(2)}
                                </span>
                                <SignedNumber
                                    value={(Number(roe.at(-1)) / 2).toFixed(2) ?? 0}
                                    postfix={'%'}
                                />
                            </>
                    }
                </div>
            </div>
            <Chart
                data={
                    viewType === 'history' ?
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
                    viewType === 'history' ?
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
