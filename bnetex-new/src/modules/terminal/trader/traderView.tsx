import { ReactChild, ReactFragment, ReactPortal, useEffect, useRef, useState } from 'react';
import {Button, Input, ToggleButton, ToggleButtonGroup} from 'lib/ui-kit';
import clsx from 'clsx';
import styles from './traderView.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import MarginPopUp from './components/modals/marginPopUp';
import LeverPopUp from './components/modals/leverPopUp';
import { useModal } from 'lib/hooks/useModal';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { getWallets } from 'store/action-creators/wallet';
import { getUserInfo } from 'lib/utils/getUserInfo';
import { getUserFuturesWallet } from 'services/getUserFuturesWallet';
import { useForm } from 'react-hook-form';
import { sendFuturesOrder } from 'services/trading/sendFuturesOrder';
import {getCurrentLeverageAndIsolated} from "../../../services/trading/getCurrentLeverageAndIsolated";
import Binance from 'node-binance-api';
import axios from 'axios';
import te from 'date-fns/esm/locale/te/index.js';

type TraderViewType = 'limit' | 'tpsl';
type TraderSumType  = 'exactSum' | 'percent';

interface TradeFormData {
    side: string,
    type: string,
    amount: number
}

const TradeView = () => {

    const { goToState } = useGoToState();
    const dispath = useAppDispatch();
    // const { mainWallet, loading: walletsLoading } = useTypedSelector(state => state.wallet);

    const [futuresWallet, setFuturesWallet] = useState<number>(0);
    const [viewType, setViewType] = useState<TraderViewType>('limit');
    const [sumType, setSumType] = useState<TraderSumType>('exactSum');
    const [leverage, setLeverage] = useState<number>(0);
    const [isolated, setIsolated] = useState<boolean>(false);
    const [limitPrice, setLimitPrice] = useState(0);
    // const [orderBook, setOrderBook] = useState<any[]>([]);
    const [orderBook, setOrderBook] = useState<any>([]);
    const [wsOrderBook, setWsOrderBook] = useState<any>([]);
    const [orderBookSnapshot, setOrderBookSnapshot] = useState<any[]>([]);
    const [orderBookStep, setOrderBookStep] = useState<number>(1);
    const refSnapshot = useRef<NodeJS.Timeout | null>(null);
    
    // let orderBookSnapshot: any[] = [];

    const { dates, roe, pnl, loading } = useTypedSelector(state => state.roePnl);

    const { open: OpenMarginModal } = useModal(MarginPopUp);
    const { open: OpenLeverModal } = useModal(LeverPopUp);
   
    const onSubmit = (data: TradeFormData) => {
        console.log(data);
        
    }

    const [tradeType, setTradeType] = useState("BUY");
    const [amount, setAmount] = useState(0);
    const [btcprice, setBtcprice] = useState(0);

    const sendOrder = (type: string) => {
        if (limitPrice !== 0) {
            sendFuturesOrder({
                side: tradeType,
            type: "LIMIT",
            price: limitPrice,
            amount: amount
            });
        } else {
            sendFuturesOrder({
                side: tradeType,
                type: type,
                amount: amount
            });   
        }        
    }

    const sendLimitOrder = (price: number, tif?: string) => {
        sendFuturesOrder({
            side: tradeType,
            type: "LIMIT",
            price: price,
            amount: amount,
            tif: tif || "GTC"
        });
    }

    const getOrderBookSnapshot = async () => {
        const res = await axios.get('https://fapi.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=1000');

        // console.log(res.data);   
        // console.log([...res.data.asks.reverse(), ...res.data.bids]);
// console.log(orderBookStep);

        const tick = parseInt((orderBookStep / 0.1).toFixed(2));

        const a = res.data.asks.reverse();
        const b = res.data.bids;

        let snapShotArr = [];

        if (orderBookStep >= 1) {
            // console.log(a);
            for (let i = 0; i < a.length; i+=tick) {
                
                const piece = a.slice(i, tick+i);

                // const sum = piece.reduce()
                const sum = piece.reduce((acc: any, cur: any[]) => acc + Number(cur[1]), 0);                
                // console.log(sum);
                // console.log(piece);
                // console.log(i);
                
                // console.log(piece.pop()[0]);

                snapShotArr.push([(Math.ceil(piece.pop()[0] / orderBookStep) * orderBookStep).toFixed(2), sum.toString()]);
            }

            for (let i = 0; i < b.length; i+=tick) {
                const piece = b.slice(i, tick+i);

                const sum = piece.reduce((acc: any, cur: any[]) => acc + Number(cur[1]), 0);
                snapShotArr.push([(Math.ceil(piece.pop()[0] / orderBookStep) * orderBookStep).toFixed(2), sum.toString()]);
            }
        } else {
            snapShotArr = [ ...a, ...b ];
        }
        console.log(snapShotArr);
        
        setOrderBookSnapshot(snapShotArr);
        // orderBookSnapshot = snapShotArr;
// console.log(orderBookSnapshot);

        // setOrderBookSnapshot([...res.data.asks.reverse(), ...res.data.bids]);
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
            });

            // const orderBookSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth20@1000ms');
        const orderBookSocket = new WebSocket('wss://fstream.binance.com/stream?streams=btcusdt@depth20');
        const btcPrice = new WebSocket('wss://stream.binance.com/stream?streams=btcusdt@miniTicker');

        orderBookSocket.onmessage = (event) => {
            let data = JSON.parse(event.data).data;
            // console.log(data);

            const spread = data.b[0];
// console.log(spread);

            let tempArr = [];
            // tempArr.push(spread);

            if (orderBookStep >= 1) {
                tempArr = [
                    ...Array.from({length: 50}, (x, i) => [parseFloat((Math.ceil(spread[0] / orderBookStep) * orderBookStep - 50 * orderBookStep + i * orderBookStep).toString()).toFixed(2), '0']),
                    [(Math.ceil(spread[0] / orderBookStep) * orderBookStep).toFixed(2), spread[1]],
                    ...Array.from({length: 50}, (x, i) => [
                        parseFloat(
                            (parseFloat( Math.ceil(spread[0] / orderBookStep) * orderBookStep) + i * orderBookStep + orderBookStep).toString()
                        ).toFixed(2), '0'])
                ]
            } else {
                tempArr = [
                    ...Array.from({length: 50}, (x, i) => [parseFloat((spread[0] - 50 * orderBookStep + i * orderBookStep).toString()).toFixed(2), '0']),
                    spread,
                    ...Array.from({length: 50}, (x, i) => [
                        parseFloat(
                            (parseFloat( spread[0]) + i * orderBookStep + orderBookStep).toString()
                        ).toFixed(2), '0'])
                ]
            }

            // console.log(tempArr[0]);

            console.log(orderBookSnapshot);      
            
            // if ( orderBookSnapshot.length === 0 ) {
                // orderBookSnapshot = tempArr;
                // setOrderBookSnapshot(tempArr)
            // }
            
            // console.log(orderBookSnapshot[0]);
            // console.log(tempArr[0]);
            // console.log(orderBookSnapshot[0]);
            // console.log(tempArr);

            tempArr.map((item, index) => {        
                const obsItem = orderBookSnapshot.find(snap_item => snap_item[0] === item[0]);
                // console.log(obsItem);
                

                if (obsItem !== undefined) {
                    tempArr[index] = obsItem;
                }
            });
            // console.log(tempArr);

            
            
            const wsArr = [...data.a, ...data.b];

            if (orderBookStep >= 1) {
                let steppedWsArr: any[][] = [];

                const tick = parseInt((orderBookStep / 0.1).toFixed(2));
                for (let i = 0; i < wsArr.length; i+=tick) {
                    
                    const piece = wsArr.slice(i, tick+i);
    
                    // const sum = piece.reduce()
                    const sum = piece.reduce((acc: any, cur: any[]) => acc + Number(cur[1]), 0);                
                    // console.log(sum);
                    // console.log(piece);
                    // console.log(i);
                    
                    // console.log(piece.pop()[0]);
    
                    steppedWsArr.push([(Math.ceil(piece.pop()[0] / orderBookStep) * orderBookStep).toFixed(2), sum.toString()]);
                }
    // console.log(steppedWsArr);
    
                tempArr.map((item, index) => {            
                    const wsItem = steppedWsArr.find(ws_item => ws_item[0] === item[0]);
                    // console.log(wsItem);
                    
                    if (wsItem !== undefined) {
                        tempArr[index] = wsItem;
                    }
    
                    // tempArr[index] = wsItem !== undefined && wsItem;
                });
            } else {
                tempArr.map((item, index) => {            
                    const wsItem = wsArr.find(ws_item => ws_item[0] === item[0]);
                    // console.log(wsItem);
                    
                    if (wsItem !== undefined) {
                        tempArr[index] = wsItem;
                    }
    
                    // tempArr[index] = wsItem !== undefined && wsItem;
                });
            }
            
console.log(tempArr);

setWsOrderBook(tempArr);

            // const temp = [ orderBookSnapshot.filter(data.a[0]) ]
            
            // setOrderBook([...data.a.reverse(), ...data.b]);
        }

        btcPrice.onmessage = (event) => {
            // console.log(JSON.parse(event.data));

            let price = JSON.parse(event.data).data.c;
            // console.log(price);
            setBtcprice(price);

            // setOrderBook([...data.b, ...data.a]);
        }

        const getUserLever = async () => {
            const res = await getCurrentLeverageAndIsolated();

            setLeverage(res.data.leverage);
            setIsolated(res.data.isolated);            
        }

        const interval = setInterval(getUserLever, 1000);
        // const snapshot = setInterval(getOrderBookSnapshot, 2000); 
        refSnapshot.current = setInterval(getOrderBookSnapshot, 2000);

        return () => {
            clearInterval(interval);
            if (!refSnapshot.current ) return;
            clearInterval(refSnapshot.current);
            // clearInterval(snapshot);
        }
    }, []);

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
        const openShortOrderLoss = orderSize * (btcprice - precisionShortOrderCost)

        const longPrice = longMargin + openLongOrderLoss;
        const shortPrice = shortMargin + openShortOrderLoss;

        console.log(longPrice);
        console.log(shortPrice);
        
        
    }, [amount]);

    useEffect(() => {
        if (refSnapshot.current ) clearInterval(refSnapshot.current);
        // clearInterval(refSnapshot.current);
        refSnapshot.current = setInterval(getOrderBookSnapshot, 2000);
        
    }, [orderBookStep]);

    useEffect(() => {
        const bigData = orderBookSnapshot;
        const smallData = wsOrderBook;
        console.log(bigData);
        console.log(smallData);
        
        

        smallData.map((item: any[]) => {
            const i = bigData.indexOf((bigDataItem: any[]) => bigDataItem[0] === item[0])
            
            if (i !== -1) {
                console.log(item);
                
                bigData[i] = item;
            }
        });

        setOrderBook(bigData);
    }, [orderBookSnapshot, setWsOrderBook])

    return (
        <div
            className={clsx(styles['trade-layout'])}
        >
            <div
                className={clsx('card', styles['cup'])}
            >
                <ToggleButtonGroup
                    title={''}
                    name={'cup_step'}
                    onChange={(value: number) => {
                        console.log(value);
                        
                        setOrderBookStep(Number(value))
                        console.log(orderBookStep);
                        
                    }}
                    value={orderBookStep.toString()}
                >
                    <ToggleButton
                        text={'0.1'}
                        value={'0.1'}
                    />
                    <ToggleButton
                        text={'1'}
                        value={'1'}
                    />
                    <ToggleButton
                        text={'10'}
                        value={'10'}
                    />
                </ToggleButtonGroup>
                <div
                    className={clsx(styles['cup-head'])}
                >
                    <span>
                        Объем (USDT)
                    </span>
                    <span>
                        Цена (USDT)
                    </span>
                </div>
                {
                    orderBookStep >= 10 ?
                        <div
                            className={clsx(styles['cup-small'])}
                        >
                            {orderBook.slice(orderBook.length/2 - 10, orderBook.length/2 + 10).reverse().map((item: any[]) => {
                                return (
                                        <div
                                            className={clsx(styles['cup-position'])}
                                            onClick={() => {
                                                sendLimitOrder(Number(item[0]), "FOK");
                                            }}
                                        >
                                            <span>
                                                {Number(item[1]).toFixed(4)}
                                            </span>
                                            <span>
                                                {item[0]}
                                            </span>
                                        </div>
                                )
                            })}
                        </div> :
                        <div
                            className={clsx(styles['cup-big'])}
                        >
                            {orderBook.slice(orderBook.length/2 - 19, orderBook.length/2 + 21).reverse().map((item: any[]) => {
                                return (
                                        <div
                                            className={clsx(styles['cup-position'])}
                                            onClick={() => {
                                                sendLimitOrder(Number(item[0]), "FOK");
                                            }}
                                        >
                                            <span>
                                                {Number(item[1]).toFixed(4)}
                                            </span>
                                            <span>
                                                {item[0]}
                                            </span>
                                        </div>
                                )
                            })}
                        </div>
                }
            </div>
            <form
                className={clsx('card', styles['trade-panel'])}
                // onSubmit={onSubmit}
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
                            OpenLeverModal({lever: leverage})
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
                        label={"Цена"}
                        postfix={"USDT"}
                        onChange={(e) => setLimitPrice(Number(e.target.value))}
                    />
                    <Input
                        label={"Количество"}
                        postfix={"USDT"}
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
                                    setAmount(1)
                                }}
                            />
                            <ToggleButton
                                text={'5$'}
                                value={'5'}
                                onClick={() => {
                                    setAmount(5)
                                }}
                            />
                            <ToggleButton
                                text={'10$'}
                                value={'10'}
                                onClick={() => {
                                    setAmount(10)
                                }}
                            />
                            <ToggleButton
                                text={'50$'}
                                value={'50'}
                                onClick={() => {
                                    setAmount(50)
                                }}
                            />
                            <ToggleButton
                                text={'100$'}
                                value={'100'}
                                onClick={() => {
                                    setAmount(100)
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
                                    setAmount((1 / (futuresWallet || 1) * 100))
                                }}
                            />
                            <ToggleButton
                                text={'5%'}
                                value={'5'}
                                onClick={() => {
                                    setAmount(5 / (futuresWallet || 1) * 100)
                                }}
                            />
                            <ToggleButton
                                text={'10%'}
                                value={'10'}
                                onClick={() => {
                                    setAmount(10 / (futuresWallet || 1) * 100)
                                }}
                            />
                            <ToggleButton
                                text={'50%'}
                                value={'50'}
                                onClick={() => {
                                    setAmount(50 / (futuresWallet || 1) * 100)
                                }}
                            />
                            <ToggleButton
                                text={'100%'}
                                value={'100'}
                                onClick={() => {
                                    setAmount(100 / (futuresWallet || 1) * 100)
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
                            text={"Купить/Лонг"}
                            type={"submit"}
                            buttonStyle={"primary"}
                            buttonTheme={"green"}
                            onClick={(e) => {
                                e.preventDefault();
                                setTradeType("BUY");
                                sendOrder("MARKET");
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
                            text={"Продать/Шорт"}
                            type={"submit"}
                            buttonStyle={"primary"}
                            buttonTheme={"red"}
                            onClick={(e) => {
                                e.preventDefault();
                                setTradeType("SELL");
                                sendOrder("MARKET");
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
