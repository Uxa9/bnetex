import { useCallback, useEffect, useRef, useState } from 'react';
import {Button, Input, ToggleButton, ToggleButtonGroup} from 'lib/ui-kit';
import clsx from 'clsx';
import styles from './traderView.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import MarginPopUp from './components/modals/marginPopUp';
import LeverPopUp from './components/modals/leverPopUp';
import { useModal } from 'lib/hooks/useModal';
import { getUserFuturesWallet } from 'services/getUserFuturesWallet';
import { sendFuturesOrder } from 'services/trading/sendFuturesOrder';
import {getCurrentLeverageAndIsolated} from '../../../services/trading/getCurrentLeverageAndIsolated';
import axios from 'axios';
import { convertPricesByTick } from './components/cup/services/convertPricesByTick';
import { getUserPositions } from 'services/trading/getUserPositions';
import { useToast } from 'lib/hooks/useToast';
import { useParams, useRoutes,  } from 'react-router-dom';
import TraderCup from './components/cup/cup';

type TraderViewType = 'limit' | 'tpsl';
type TraderSumType  = 'exactSum' | 'percent';

const TradeView = () => {
    const [futuresWallet, setFuturesWallet] = useState<number>(0);
    const [viewType, setViewType] = useState<TraderViewType>('limit');
    const [sumType, setSumType] = useState<TraderSumType>('exactSum');
    const [leverage, setLeverage] = useState<number>(0);
    const [isolated, setIsolated] = useState<boolean>(false);
    const [limitPrice, setLimitPrice] = useState(0);

    const [orderBook, setOrderBook] = useState<any>([]);
    const refSnapshot = useRef<NodeJS.Timeout | null>(null);
    const posSnapshot = useRef<NodeJS.Timeout | null>(null);

    const { open: OpenMarginModal } = useModal(MarginPopUp);
    const { open: OpenLeverModal } = useModal(LeverPopUp);

    const [tradeType, setTradeType] = useState('BUY');
    const [amount, setAmount] = useState(0);
    const [btcprice, setBtcprice] = useState(0);

    const refOrderBookSocket = useRef<WebSocket | null>(null)
    const refBtcPrice = useRef<WebSocket | null>(null)

    const { pair } = useParams();

    const sendOrder = (type: string, side: string) => {
        if (limitPrice !== 0) {
            sendFuturesOrder({
                side: side,
                type: 'LIMIT',
                price: limitPrice,
                amount: amount,
                pair: pair,
            });
        } else {
            sendFuturesOrder({
                side: side,
                type: type,
                amount: amount,
                pair: pair,
            });
        }
    };

    useEffect(() => {
        getUserFuturesWallet()
            .then((res) => {
                setFuturesWallet(res.data.toFixed(3));
            });

        getCurrentLeverageAndIsolated()
            .then((res) => {
                setLeverage(Number(res.data.leverage));
                setIsolated(res.data.isolated);
            })
            .catch(() => {
                setLeverage(10);
                setIsolated(true);
            });

        refOrderBookSocket.current = new WebSocket(`wss://fstream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@depth20`);
        refBtcPrice.current = new WebSocket(`wss://stream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@miniTicker`);

        return () => {
            if (!refSnapshot.current ) return;
            clearInterval(refSnapshot.current);

            if (!posSnapshot.current ) return;
            clearInterval(posSnapshot.current);
        };
    }, []);

    // Расчет цены ликвидации
    useEffect(() => {
        const nominalMargin = btcprice / leverage;

        const bid = orderBook.length !== 0 ? orderBook[51][0] : 1;
        const ask = orderBook.length !== 0 ? orderBook[50][0] : 1;

        const shortLoss = limitPrice !== 0 ? btcprice - limitPrice : btcprice - bid;

        const openCostLong = nominalMargin;
        const openCostShort = nominalMargin + shortLoss;

        const precisionLongOrderCost = limitPrice !== 0 ? limitPrice * 1.05 : bid * 1.05;
        const precisionShortOrderCost = limitPrice !== 0 ? limitPrice : ask;

        const orderSize = amount / btcprice;

        const longMargin = precisionLongOrderCost * orderSize / leverage;
        const shortMargin = precisionShortOrderCost * orderSize / leverage;

        const openLongOrderLoss = orderSize * -1 * (btcprice - precisionLongOrderCost);
        const openShortOrderLoss = orderSize * (btcprice - precisionShortOrderCost);

        const longPrice = longMargin + openLongOrderLoss;
        const shortPrice = shortMargin + openShortOrderLoss;
    }, [amount]);

    return (
        <div
            className={clsx(styles['trade-layout'])}
        >
            <div
                className={clsx('card')}
            >
                <TraderCup
                    amount={amount}
                />
            </div>
            <form
                className={clsx('card', styles['trade-panel'])}
            >
                <div
                    className={styles['trader-view-wrapper__header']}
                >
                    <Button
                        buttonStyle="secondary"
                        text="Перекрестная"
                        onClick={(e) => {
                            e.preventDefault();
                            OpenMarginModal({isolated: isolated});
                        }}
                    />
                    <Button
                        buttonStyle="secondary"
                        text={`${leverage}x`}
                        onClick={(e) => {
                            e.preventDefault();
                            OpenLeverModal({lever: leverage});
                        }}
                    />
                </div>
                <div
                    className={styles['trader-view-trade-type']}
                >
                    <ToggleButtonGroup
                        title={''}
                        name={'trader_type'}
                        onChange={(value: TraderViewType) => {
                            setViewType(value);
                        }}
                        value={viewType}
                    >
                        <ToggleButton
                            text={'Маркет/Лимит'}
                            value={'limit'}
                        />
                        <ToggleButton
                            text={'TP/SL'}
                            value={'tpsl'}
                        />
                    </ToggleButtonGroup>
                </div>
                <div
                    className={styles['balance-and-max']}
                >
                    <p
                        className={styles['text']}
                    >
                        <span
                            className={'caption-mini'}
                        >
                            Доступно
                        </span>
                        <span
                            className={'subtitle'}
                        >
                            {`${futuresWallet} USDT`}
                        </span>
                    </p>
                    <p
                        className={styles['text']}
                    >
                        <span
                            className={'caption-mini'}
                        >
                            Макс.
                        </span>
                        <span
                            className={'subtitle'}
                        >
                            USDT
                        </span>
                    </p>
                </div>
                <div
                    className={styles['input-fields']}
                >
                    <Input
                        label={'Цена'}
                        postfix={'USDT'}
                        onChange={(e) => setLimitPrice(Number(e.target.value))}
                    />
                    <Input
                        label={'Количество'}
                        postfix={'USDT'}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        value={amount}
                    />
                </div>
                <div
                    className={styles['trade-sum-type']}
                >
                    <ToggleButtonGroup
                        title={''}
                        name={'trader_sum'}
                        onChange={(value: TraderSumType) => {
                            setSumType(value);
                        }}
                        value={sumType}
                    >
                        <ToggleButton
                            text={'$'}
                            value={'exactSum'}
                        />
                        <ToggleButton
                            text={'%'}
                            value={'percent'}
                        />
                    </ToggleButtonGroup>
                </div>
                <div
                    className={styles['trade-sum-selector']}
                >
                    {
                        sumType === 'exactSum' ?
                            <ToggleButtonGroup
                                title={''}
                                name={'trader_sum'}
                                onChange={() => {

                                }}
                                value={sumType}
                            >
                                <ToggleButton
                                    text={'1$'}
                                    value={'1'}
                                    onClick={() => {
                                        setAmount(1);
                                    }}
                                />
                                <ToggleButton
                                    text={'5$'}
                                    value={'5'}
                                    onClick={() => {
                                        setAmount(5);
                                    }}
                                />
                                <ToggleButton
                                    text={'10$'}
                                    value={'10'}
                                    onClick={() => {
                                        setAmount(10);
                                    }}
                                />
                                <ToggleButton
                                    text={'50$'}
                                    value={'50'}
                                    onClick={() => {
                                        setAmount(50);
                                    }}
                                />
                                <ToggleButton
                                    text={'100$'}
                                    value={'100'}
                                    onClick={() => {
                                        setAmount(100);
                                    }}
                                />
                            </ToggleButtonGroup> :
                            <ToggleButtonGroup
                                title={''}
                                name={'trader_sum'}
                                onChange={() => {

                                }}
                                value={sumType}
                            >
                                <ToggleButton
                                    text={'1%'}
                                    value={'1'}
                                    onClick={() => {
                                        setAmount((1 / (futuresWallet || 1) * 100));
                                    }}
                                />
                                <ToggleButton
                                    text={'5%'}
                                    value={'5'}
                                    onClick={() => {
                                        setAmount(5 / (futuresWallet || 1) * 100);
                                    }}
                                />
                                <ToggleButton
                                    text={'10%'}
                                    value={'10'}
                                    onClick={() => {
                                        setAmount(10 / (futuresWallet || 1) * 100);
                                    }}
                                />
                                <ToggleButton
                                    text={'50%'}
                                    value={'50'}
                                    onClick={() => {
                                        setAmount(50 / (futuresWallet || 1) * 100);
                                    }}
                                />
                                <ToggleButton
                                    text={'100%'}
                                    value={'100'}
                                    onClick={() => {
                                        setAmount(100 / (futuresWallet || 1) * 100);
                                    }}
                                />
                            </ToggleButtonGroup>
                    }
                </div>
                <div
                    className={styles['submit-form-buttons']}
                >
                    <div>
                        <Button
                            text={'Купить/Лонг'}
                            type={'submit'}
                            buttonStyle={'primary'}
                            buttonTheme={'green'}
                            onClick={(e) => {
                                e.preventDefault();
                                setTradeType('BUY');
                                sendOrder('MARKET', 'BUY');
                            }}
                        />
                        <div
                            className={styles['form-buttons-text']}
                        >
                            <p
                                className={styles['text']}
                            >
                                <span
                                    className={'caption-mini'}
                                >
                                    Расч. цена ликв.
                                </span>
                                <span
                                    className={'subtitle'}
                                >
                                    --
                                </span>
                            </p>
                            <p
                                className={styles['text']}
                            >
                                <span
                                    className={'caption-mini'}
                                >
                                    Стоимость
                                </span>
                                <span
                                    className={'subtitle'}
                                >
                                    USDT
                                </span>
                            </p>
                            <p
                                className={styles['text']}
                            >
                                <span
                                    className={'caption-mini'}
                                >
                                    Макс.
                                </span>
                                <span
                                    className={'subtitle'}
                                >
                                    USDT
                                </span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <Button
                            text={'Продать/Шорт'}
                            type={'submit'}
                            buttonStyle={'primary'}
                            buttonTheme={'red'}
                            onClick={(e) => {
                                e.preventDefault();
                                setTradeType('SELL');
                                sendOrder('MARKET', 'SELL');
                            }}
                        />
                        <div
                            className={styles['form-buttons-text']}
                        >
                            <p
                                className={styles['text']}
                            >
                                <span
                                    className={'caption-mini'}
                                >
                                    Расч. цена ликв.
                                </span>
                                <span
                                    className={'subtitle'}
                                >
                                    --
                                </span>
                            </p>
                            <p
                                className={styles['text']}
                            >
                                <span
                                    className={'caption-mini'}
                                >
                                    Стоимость
                                </span>
                                <span
                                    className={'subtitle'}
                                >
                                    USDT
                                </span>
                            </p>
                            <p
                                className={styles['text']}
                            >
                                <span
                                    className={'caption-mini'}
                                >
                                    Макс.
                                </span>
                                <span
                                    className={'subtitle'}
                                >
                                    USDT
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TradeView;
