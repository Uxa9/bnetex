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
    const [wsOrderBook, setWsOrderBook] = useState<any>([]);
    const [orderBookSnapshot, setOrderBookSnapshot] = useState<any[]>([]);
    const [orderBookStep, setOrderBookStep] = useState<number>(0.1);
    const refSnapshot = useRef<NodeJS.Timeout | null>(null);
    const posSnapshot = useRef<NodeJS.Timeout | null>(null);

    const [currentPrice, setCurrentPrice] = useState<any>(0);
    const [entryPrice, setEntryPrice] = useState<any>(0);
    const [posType, setPosType] = useState<string>("long");
    const [lastPrice, setLastPrice] = useState<number>(0);

    const { open: OpenMarginModal } = useModal(MarginPopUp);
    const { open: OpenLeverModal } = useModal(LeverPopUp);

    const [tradeType, setTradeType] = useState('BUY');
    const [amount, setAmount] = useState(0);
    const [btcprice, setBtcprice] = useState(0);
    const { bakeToast } = useToast();

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

    const sendLimitOrder = (price: number, tradeType?: string, tif?: string) => {       

        if (amount === 0) bakeToast.error("Объем должен быть больше 0");

        sendFuturesOrder({
            side: tradeType || "BUY",
            type: 'LIMIT',
            price: price,
            amount: amount,
            tif: tif || 'GTX',
            pair: pair
        }).then((res) => {
            if (res.data === "") {
                tradeType === "BUY" ?
                    bakeToast.success("Ордер на покупку выполнен") :
                    bakeToast.success("Ордер на продажу выполнен");
            } else {
                console.log(res);
                bakeToast.error("Ошибка");
            }         
        });
    };

    const getOrderBookSnapshot = async () => {
        const res = await axios.get('https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=1000');

        const asks: string[][] = res.data.asks.reverse();
        const bids: string[][] = res.data.bids.reverse();

        if (orderBookStep === 0.1) {
            setOrderBookSnapshot(asks.concat(bids));
            return;
        }

        const tick = parseInt((orderBookStep / 0.1).toFixed(2), 10);

        const convertedAsks = convertPricesByTick(asks, tick);
        const convertedBids = convertPricesByTick(bids, tick);

        setOrderBookSnapshot(convertedAsks.concat(convertedBids));
    };

    const getUserP = async () => {
        // const res = await getUserPositions();
        // const { inf } = res.data;

        // if (inf.length > 0) {
        //     const curPosition = inf.find((item: any) => item.symbol === pair);

        //     Number(curPosition.positionAmt) > 0 ? 
        //         setPosType("long") :
        //         setPosType("short");

        //     setEntryPrice(curPosition.entryPrice);     
        // } else {
        //     setEntryPrice(0);
        // }       
    }

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

        

        refSnapshot.current = setInterval(getOrderBookSnapshot, 1000);
        posSnapshot.current = setInterval(getUserP, 1000);

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

    useEffect(() => {

        refOrderBookSocket.current?.close();
        refBtcPrice.current?.close();

        refOrderBookSocket.current = new WebSocket(`wss://fstream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@depth20`);
        refBtcPrice.current = new WebSocket(`wss://stream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@miniTicker`);

        refOrderBookSocket.current.onmessage = (event) => {
            const { a, b } = JSON.parse(event.data).data;

            setWsOrderBook(a.reverse().concat(b));
            
        };

        refBtcPrice.current.onmessage = (event) => {
            // console.log(JSON.parse(event.data));

            let price = JSON.parse(event.data).data.c;
            // console.log(price);
            setBtcprice(price);

            // setOrderBook([...data.b, ...data.a]);
        };

        if (posSnapshot.current ) clearInterval(posSnapshot.current);
        posSnapshot.current = setInterval(getUserP, 1000);
    }, [pair]);

    useEffect(() => {
        if (refSnapshot.current ) clearInterval(refSnapshot.current);
        refSnapshot.current = setInterval(getOrderBookSnapshot, 2000);

    }, [orderBookStep]);

    useEffect(() => {
        const bigData = orderBookSnapshot;
        let smallData = wsOrderBook;

        // console.log(smallData);
        if (orderBookStep !== 0.1) {
            const tick = parseInt((orderBookStep / 0.1).toFixed(2), 10);

            smallData = convertPricesByTick(smallData, tick);
        }

        smallData.map((item: any[]) => {
            const i = bigData.findIndex((bigDataItem: any[]) => bigDataItem[0] === item[0]);

            if (i !== -1) {
                bigData[i] = item;
            }
        });

        if (smallData.length > 0) {
            setCurrentPrice(Number(smallData[19][0]));        
        }

        setOrderBook(bigData);
    }, [orderBookSnapshot, wsOrderBook, orderBookStep]);
    // }, [orderBookSnapshot, wsOrderBook])

    const renderTradeCup = (length: number) => {
        const tradeCupArr = wsOrderBook.slice(wsOrderBook.length/2 - length, wsOrderBook.length/2 + length);
        // console.log(tradeCupArr);

        const maxVolume = Math.max(...tradeCupArr.map((item: string[]) => parseFloat(item[1])));

        // console.log(maxVolume);

        return tradeCupArr.map((item: any[], index: any) => {

            const parseBgColor = () => {

                const percent = item[1]/ maxVolume * 100;             

                const greenColor = () => {

                    if (percent < 25) return '#84E088';
                    if (percent < 50) return '#5CD662';
                    if (percent < 75) return '#17CE1F';

                    return '#0B8D11';
                };

                const redColor = () => {

                    if (percent < 25) return '#E08484';
                    if (percent < 50) return '#D65C5C';
                    if (percent < 75) return '#EC1313';

                    return '#8D0B0B';
                };

                if (index > tradeCupArr.length / 2) {

                    let color = greenColor();

                    return {
                        background: `linear-gradient(90deg, ${color} 0%, ${color} ${item[1]/ maxVolume * 100}%, #00000000 ${item[1]/ maxVolume * 100}%)`,
                    };
                }
                if (index < tradeCupArr.length / 2 - 1) {

                    let color = redColor();

                    return {
                        background: `linear-gradient(90deg, ${color} 0%, ${color} ${item[1]/ maxVolume * 100}%, #00000000 ${item[1]/ maxVolume * 100}%)`,
                    };
                }

                return {};
            };

            
            const greaterCheck = Number(entryPrice) > Number(item[0]);
console.log(entryPrice);
console.log(greaterCheck);
console.log(posType);


            const parsePrice = () => {
                // console.log(entryPrice);
                // console.log(Number(item[0]));                
                // console.log(greaterCheck);

                if (Number(entryPrice) !== 0) {
                    if (greaterCheck) {
                        if (index < tradeCupArr.length / 2) {
                            if (posType === "long") {
                                return {
                                    // red
                                    background: '#EC1313',
                                    paddingLeft: '10px'
                                }
                            } else {
                                return {
                                    // green
                                    background: '#17CE1F',
                                    paddingLeft: '10px'
                                }
                            }
                        }
                        return {}
                    } else {
                        if (index > tradeCupArr.length / 2 - 1) {
                            if (posType === "long") {
                                return {
                                    // green
                                    background: '#17CE1F',
                                    paddingLeft: '10px'
                                }
                            } else {
                                return {
                                    // red
                                    background: '#EC1313',
                                    paddingLeft: '10px'
                                }
                            }
                        }
                        return {}
                    }
                    // else if (index > tradeCupArr.length / 2) {
                    //     return {}
                    // } else {
                    //     return {
                    //         // green
                    //         background: '#17CE1F',
                    //         paddingLeft: '10px'
                    //     }
                    // }
                } else {
                    return {}              
                }                
            }

            return (
                <div
                    className={clsx(styles['cup-position'])}
                    onClick={() => {
                        index < tradeCupArr.length / 2 ?
                            sendLimitOrder(Number(item[0]), "SELL" ,'GTC') :
                            sendLimitOrder(Number(item[0]), "BUY" ,'GTC');
                    }}
                    style={parseBgColor()}
                >
                    <span>
                        {Number(item[1]).toFixed(4)}
                    </span>
                    <span
                        style={parsePrice()} 
                    >
                        {item[0]}
                    </span>
                </div>
            );
        });
    };

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
