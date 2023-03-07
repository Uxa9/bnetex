import axios from "axios";
import clsx from "clsx";
import { useToast } from "lib/hooks/useToast";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";import { getUserPositions } from "services/trading/getUserPositions";
import { sendFuturesOrder } from "services/trading/sendFuturesOrder";
import { convertPricesByTick } from "./services/convertPricesByTick";
import styles from './cup.module.scss';
import renderTradeCup from "./renderTradeCup";
import RenderTradeCup from "./renderTradeCup";

const TraderCup = (props: any) => {

    const { amount } = props;
    // const [orderBook, setOrderBook] = useState<any>([]);
    // const [wsOrderBook, setWsOrderBook] = useState<any>([]);
    // const [orderBookSnapshot, setOrderBookSnapshot] = useState<any[]>([]);
    // const [orderBookStep, setOrderBookStep] = useState<number>(0.1);
    // const refSnapshot = useRef<NodeJS.Timeout | null>(null);
    // const posSnapshot = useRef<NodeJS.Timeout | null>(null);

    // const [entryPrice, setEntryPrice] = useState<any>(0);
    // const [posType, setPosType] = useState<string>("long");

    // const [amount, setAmount] = useState(0);
    // const [btcprice, setBtcprice] = useState(0);
    // const { bakeToast } = useToast();

    // const refOrderBookSocket = useRef<WebSocket | null>(null)
    // const refBtcPrice = useRef<WebSocket | null>(null)

    // const { pair } = useParams();

    // const sendLimitOrder = (price: number, tradeType?: string, tif?: string) => {

    //     if (amount === 0) bakeToast.error("Объем должен быть больше 0");

    //     sendFuturesOrder({
    //         side: tradeType || "BUY",
    //         type: 'LIMIT',
    //         price: price,
    //         amount: amount,
    //         tif: tif || 'GTX',
    //         pair: pair
    //     }).then((res) => {
    //         if (res.data === "") {
    //             tradeType === "BUY" ?
    //                 bakeToast.success("Заявка на покупку выставлена") :
    //                 bakeToast.success("Заявка на продажу выставлена");
    //         } else {
    //             console.log(res);
    //             bakeToast.error("Ошибка");
    //         }
    //     });
    // };

    // const getUserP = async () => {
    //     const res = await getUserPositions();
    //     const { inf } = res.data;

    //     if (inf.length > 0) {
    //         const curPosition = inf.find((item: any) => item.symbol === pair);

    //         Number(curPosition.positionAmt) > 0 ?
    //             setPosType("long") :
    //             setPosType("short");

    //         setEntryPrice(curPosition.entryPrice);
    //     } else {
    //         setEntryPrice(0);
    //     }
    // }

    // useEffect(() => {

    //     refSnapshot.current = setInterval(getOrderBookSnapshot, 1000);
    //     posSnapshot.current = setInterval(getUserP, 1000);

    //     refOrderBookSocket.current = new WebSocket(`wss://fstream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@depth20`);
    //     refBtcPrice.current = new WebSocket(`wss://stream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@miniTicker`);

    //     return () => {
    //         if (!refSnapshot.current) return;
    //         clearInterval(refSnapshot.current);

    //         if (!posSnapshot.current) return;
    //         clearInterval(posSnapshot.current);
    //     };
    // }, []);

    // useEffect(() => {

    //     refOrderBookSocket.current?.close();
    //     refBtcPrice.current?.close();

    //     refOrderBookSocket.current = new WebSocket(`wss://fstream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@depth20`);
    //     refBtcPrice.current = new WebSocket(`wss://stream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@miniTicker`);

    //     refOrderBookSocket.current.onmessage = (event) => {
    //         const { a, b } = JSON.parse(event.data).data;

    //         setWsOrderBook(a.reverse().concat(b));

    //     };

    //     refBtcPrice.current.onmessage = (event) => {
    //         // console.log(JSON.parse(event.data));

    //         let price = JSON.parse(event.data).data.c;
    //         // console.log(price);
    //         setBtcprice(price);

    //         // setOrderBook([...data.b, ...data.a]);
    //     };

    //     if (posSnapshot.current) clearInterval(posSnapshot.current);
    //     posSnapshot.current = setInterval(getUserP, 1000);
    // }, [pair]);

    // useEffect(() => {
    //     if (refSnapshot.current) clearInterval(refSnapshot.current);
    //     refSnapshot.current = setInterval(getOrderBookSnapshot, 2000);

    // }, [orderBookStep]);

    // useEffect(() => {
    //     const bigData = orderBookSnapshot;
    //     let smallData = wsOrderBook;

    //     // console.log(smallData);
    //     if (orderBookStep !== 0.1) {
    //         const tick = parseInt((orderBookStep / 0.1).toFixed(2), 10);

    //         smallData = convertPricesByTick(smallData, tick);
    //     }

    //     smallData.map((item: any[]) => {
    //         const i = bigData.findIndex((bigDataItem: any[]) => bigDataItem[0] === item[0]);

    //         if (i !== -1) {
    //             bigData[i] = item;
    //         }
    //     });

    //     setOrderBook(bigData);
    // }, [orderBookSnapshot, wsOrderBook, orderBookStep]);
    // // }, [orderBookSnapshot, wsOrderBook])

    // const renderTradeCup = (length: number) => {
    //     const tradeCupArr = wsOrderBook.slice(wsOrderBook.length / 2 - length, wsOrderBook.length / 2 + length);
    //     // console.log(tradeCupArr);

    //     const maxVolume = Math.max(...tradeCupArr.map((item: string[]) => parseFloat(item[1])));

    //     // console.log(maxVolume);

    //     return tradeCupArr.map((item: any[], index: any) => {

    //         const parseBgColor = () => {

    //             const percent = item[1] / maxVolume * 100;

    //             const greenColor = () => {

    //                 if (percent < 25) return '#84E088';
    //                 if (percent < 50) return '#5CD662';
    //                 if (percent < 75) return '#17CE1F';

    //                 return '#0B8D11';
    //             };

    //             const redColor = () => {

    //                 if (percent < 25) return '#E08484';
    //                 if (percent < 50) return '#D65C5C';
    //                 if (percent < 75) return '#EC1313';

    //                 return '#8D0B0B';
    //             };

    //             if (index > tradeCupArr.length / 2) {

    //                 let color = greenColor();

    //                 return {
    //                     background: `linear-gradient(90deg, ${color} 0%, ${color} ${item[1] / maxVolume * 100}%, #00000000 ${item[1] / maxVolume * 100}%)`,
    //                 };
    //             }
    //             if (index < tradeCupArr.length / 2 - 1) {

    //                 let color = redColor();

    //                 return {
    //                     background: `linear-gradient(90deg, ${color} 0%, ${color} ${item[1] / maxVolume * 100}%, #00000000 ${item[1] / maxVolume * 100}%)`,
    //                 };
    //             }

    //             return {};
    //         };


    //         const greaterCheck = Number(entryPrice) > Number(item[0]);


    //         const parsePrice = () => {

    //             if (Number(entryPrice) !== 0) {
    //                 if (greaterCheck) {
    //                     if (index < tradeCupArr.length / 2) {
    //                         if (posType === "long") {
    //                             return {
    //                                 // red
    //                                 background: '#EC1313',
    //                                 paddingLeft: '10px'
    //                             }
    //                         } else {
    //                             return {
    //                                 // green
    //                                 background: '#17CE1F',
    //                                 paddingLeft: '10px'
    //                             }
    //                         }
    //                     }
    //                     return {}
    //                 } else {
    //                     if (index > tradeCupArr.length / 2 - 1) {
    //                         if (posType === "long") {
    //                             return {
    //                                 // green
    //                                 background: '#17CE1F',
    //                                 paddingLeft: '10px'
    //                             }
    //                         } else {
    //                             return {
    //                                 // red
    //                                 background: '#EC1313',
    //                                 paddingLeft: '10px'
    //                             }
    //                         }
    //                     }
    //                     return {}
    //                 }
    //             } else {
    //                 return {}
    //             }
    //         }

    //         return (
    //             <div
    //                 className={clsx(styles['cup-position'])}
    //                 onClick={() => {
    //                     index < tradeCupArr.length / 2 ?
    //                         sendLimitOrder(Number(item[0]), "SELL", 'GTC') :
    //                         sendLimitOrder(Number(item[0]), "BUY", 'GTC');
    //                 }}
    //                 style={parseBgColor()}
    //             >
    //                 <span>
    //                     {Number(item[1]).toFixed(4)}
    //                 </span>
    //                 <span
    //                     style={parsePrice()}
    //                 >
    //                     {item[0]}
    //                 </span>
    //             </div>
    //         );
    //     });
    // };

    return (
        <div
            className={clsx('card', styles['cup'])}
        >
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
            <RenderTradeCup
                amount={amount}
            />
        </div>
    );
}


export default TraderCup