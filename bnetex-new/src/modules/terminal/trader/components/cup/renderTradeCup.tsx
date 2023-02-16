import { WebsocketContext } from "../../../../../context/WebsocketContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { convertPricesByTick, getOrderBookSnapshot } from "./services/getOrderBookSnapshot";
import { useToast } from "lib/hooks/useToast";
import { sendFuturesOrder } from "services/trading/sendFuturesOrder";
import clsx from "clsx";
import styles from './cup.module.scss';

const RenderTradeCup = (props: any) => {

    const refSnapshot = useRef<NodeJS.Timeout | null>(null);
    const posSnapshot = useRef<NodeJS.Timeout | null>(null);
    
    const refOrderBookSocket = useRef<WebSocket | null>(null);
    const refPairPrice = useRef<WebSocket | null>(null);

    const [posType, setPosType] = useState<string>("long");
    const [posPrice, setPosPrice] = useState<any>(0);
    const [pairPrice, setPairPrice] = useState<any>([0 , 'increase']);
    const [test, setTest] = useState<any>(undefined);
    const [orderBookStep, setOrderBookStep] = useState<number>(0.1);
    const [orderBook, setOrderBook] = useState<any>([]);

    const [wsOrderBook, setWsOrderBook] = useState<any>([]);
    
    const { bakeToast } = useToast();
    
    const socket = useContext(WebsocketContext);
    
    const { pair } = useParams();
    const { amount } = props;

    const [orderBookSnapshot, setOrderBookSnapshot] = useState<any[]>([]);

    const orderBookSnapshotFunc = async () => {
        const snapshot = await getOrderBookSnapshot(pair);

        setOrderBookSnapshot(snapshot);
    }

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

    useEffect(() => {

        refSnapshot.current = setInterval(orderBookSnapshotFunc, 2000);

        refOrderBookSocket.current = new WebSocket(`wss://fstream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@depth20`);
        refPairPrice.current = new WebSocket(`wss://stream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@miniTicker`);

        socket.emit("userTraderPosition", "");

        socket.on('currentUserTradePosition', (response: any) => {
            const { inf } = response;

            if (inf.length > 0) {
                const curPosition = inf.find((item: any) => item.symbol === pair);

                Number(curPosition.positionAmt) > 0 ? 
                    setPosType("long") :
                    setPosType("short");

                setPosPrice(curPosition.entryPrice);     
            } else {
                setPosPrice(0);
            }     
        });

        return () => {
            if (!refSnapshot.current ) return;
            clearInterval(refSnapshot.current);

            if (!posSnapshot.current ) return;
            clearInterval(posSnapshot.current);

            socket.off('connect');
            socket.off('onMessage');
        }
    }, []);

    useEffect(() => {

        refOrderBookSocket.current?.close();
        refPairPrice.current?.close();

        refOrderBookSocket.current = new WebSocket(`wss://fstream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@depth20`);
        refPairPrice.current = new WebSocket(`wss://stream.binance.com/stream?streams=${pair?.toLocaleLowerCase()}@miniTicker`);

        refOrderBookSocket.current.onmessage = (event) => {
            const { a, b } = JSON.parse(event.data).data;

            setWsOrderBook(a.reverse().concat(b));
            
        };

        refPairPrice.current.onmessage = (event) => {
            let price = JSON.parse(event.data).data.c;

            // haha
            setTest(price);    
        };

    }, [pair]);

    useEffect(() => {
        // HAHAHAHAHA
        // che za huita
        if (test >= pairPrice[0]) setPairPrice([test, "increase"]);
        else setPairPrice([test, "decrease"]);
    }, test);

    useEffect(() => {
        if (refSnapshot.current ) clearInterval(refSnapshot.current);
        refSnapshot.current = setInterval(orderBookSnapshotFunc, 2000);

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

        setOrderBook(bigData);
    }, [orderBookSnapshot, wsOrderBook, orderBookStep]);

    const renderTradeCups = (length: number) => {
        const tradeCupArr = wsOrderBook.slice(wsOrderBook.length / 2 - length, wsOrderBook.length / 2 + length);
        // console.log(tradeCupArr);

        const maxVolume = Math.max(...tradeCupArr.map((item: string[]) => parseFloat(item[1])));

        // console.log(maxVolume);

        return tradeCupArr.map((item: any[], index: any) => {

            const greaterCheck = Number(posPrice) > Number(item[0]);

            const parseBgColor = () => {

                const percent = item[1] / maxVolume * 100;

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
                        background: `linear-gradient(90deg, ${color} 0%, ${color} ${item[1] / maxVolume * 100}%, #00000000 ${item[1] / maxVolume * 100}%)`,
                    };
                }
                if (index < tradeCupArr.length / 2 - 1) {

                    let color = redColor();

                    return {
                        background: `linear-gradient(90deg, ${color} 0%, ${color} ${item[1] / maxVolume * 100}%, #00000000 ${item[1] / maxVolume * 100}%)`,
                    };
                }

                return {};
            };

            const parsePrice = () => {
                if (Number(posPrice) !== 0) {
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
                } else {
                    return {}
                }
            }


            const pricePicker = () => {

                if (Number(posPrice) !== 0) {

                    if (greaterCheck) {
                        if (index < tradeCupArr.length / 2) {
                            if (posType === "long") return styles['pos-red']
                            else return styles['pos-green']
                        }
                        return "";
                    } else {
                        if (index > tradeCupArr.length / 2 - 1) {
                            if (posType === "long") return styles['pos-green']
                            else return styles['pos-red']
                        }
                        return "";
                    }
                } else {
                    return "";
                }
            }

            const bgPicker = (percent: number) => {
                if (index < tradeCupArr.length / 2) {
                    if (percent < 25) return styles['quater-bg-green']
                    if (percent < 50) return styles['half-bg-green']
                    if (percent < 75) return styles['three-four-bg-green']
                    return styles['full-bg-green'];
                } else {
                    if (percent < 25) return styles['quater-bg-red']
                    if (percent < 50) return styles['half-bg-red']
                    if (percent < 75) return styles['three-four-bg-red']
                    return styles['full-bg-red'];
                }
            }

            // const classPicker = () => {
            //     const cls = [styles['cup-position']];

            //     const percent = item[1] / maxVolume * 100;

            //     cls.push(bgPicker(percent));
            //     cls.push(pricePicker());

            //     return cls;
            // }
            
            const classPicker = () => {
                if (Number(posPrice) === Number(item[0])) return [styles["cup-position"], styles['entry-price']];
                if (index === tradeCupArr.length / 2) {
                    if (pairPrice[1] === "increase") {
                        return [styles["cup-position"], styles["pair-price"], styles["price-positive"]]
                    }
                    else {
                        return [styles["cup-position"], styles["pair-price"], styles["price-negative"]]
                    }
                }
                else return styles["cup-position"];
            }

            return (
                <div
                    className={clsx(classPicker())}
                    onClick={() => {
                        index < tradeCupArr.length / 2 ?
                            sendLimitOrder(Number(item[0]), "SELL", 'GTC') :
                            sendLimitOrder(Number(item[0]), "BUY", 'GTC');
                    }}
                    style={parseBgColor()}
                >
                    <span>
                        {Number(item[1]).toFixed(4)}
                    </span>
                    <span className={pricePicker()}>
                        {item[0]}
                    </span>
                </div>
            );
        });
    };

    return (
        <>
            {renderTradeCups(20)}
        </>
    )
}

export default RenderTradeCup;