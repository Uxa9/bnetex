import clsx from 'clsx';
import { WebsocketContext } from '../../../../../context/WebsocketContext';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import CoinSymbol from 'modules/terminal/components/coinSymbol/coinSymbol';
import { CoinSymbolProps } from 'modules/terminal/types/coinSymbol';
import { Margin } from 'modules/terminal/types/margin';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { closeAllPositions } from 'services/trading/closeAllPositions';
import { getUserPositions } from 'services/trading/getUserPositions';
import { getUserOpenPosition } from 'services/user';
import { mockedOpenePositions } from './mock';
import styles from './openedPositions.module.scss';

export interface OpenedPosition {
    // coinSymbol: CoinSymbolProps;
    amount: number;
    entryPrice: number;
    markedPrice: number;
    // liquidationPrice: number;
    margin: Margin;
    PNL: number; // считается по текущей цене...
}

// toDo сделать максимально просто....

const OpenedPositions = () => {

    const evaluateMarginType = (type: string) => {
        return type === 'cross' ? 'кросс' : 'изолир.';
    };
    const [data, setData] = useState<OpenedPosition[]>([]);

    const location = useLocation();

    const socket = useContext(WebsocketContext);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected!');
        });

        socket.on('currentPosition', (tradeInfo: any) => {
            setData([{
                amount: tradeInfo.volume,
                entryPrice: tradeInfo.entryPrice,
                markedPrice: tradeInfo.markPrice,
                margin: {
                    value: 0,
                    type: "cross"
                },
                PNL: tradeInfo.userPnl,
            }]);
        });

        return () => {
            console.log('Unregistering Events...');
            socket.off('connect');
            socket.off('onMessage');
        };
    }, []);

    useEffect(() => {        
        if (location.pathname.split('/').pop() === "trader") {
            const getUserP = async () => {
                const res = await getUserPositions();

                // console.log(res.data);

                // const btcPosition = res.data.inf.find((item: any) => item.symbol === "BTCUSDT");

                const { inf, pos } = res.data;

                // if (Number(inf.positionAmt) === 0) return;
                // console.log(btcPosition);
                
                await setData([{
                    amount : Number(inf.positionAmt),
                    entryPrice : Number(Number(inf.entryPrice).toFixed(2)),
                    markedPrice : Number(Number(pos.markPrice).toFixed(2)),
                    margin : {
                        value: Number(Number(inf.initialMargin).toFixed(2)),
                        type: pos.marginType
                    },
                    PNL : Number(inf.unrealizedProfit)
                }]);

                // console.log(data);
                
            }

            setInterval(getUserP, 1000);
            // getUserP()
        }
    }, [])

    useEffect(() => {
        getUserOpenPosition()
            .then((res) => {
                setData(res.data);
            });
    }, [ /* тут нада из стейта брать в работе или не в работе */]);

    return (
        <>            
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <span
                    onClick={() => closeAllPositions()}
                >
                    Закрыть все позиции
                </span>
            </div>
            <table className={styles['opened-positions']}>
                <thead>
                    <tr className={'caption'}>
                        <th>Символ</th>
                        <th>Размер</th>
                        <th className={styles['desktop-price-label']}>Цена входа</th>
                        <th className={styles['desktop-price-label']}>Цена маркировки</th>
                        {/* <th className={styles['desktop-price-label']}>Цена ликвидации</th> */}
                        <th className={styles['mobile-price-label']}>
                            Цена входа / маркировки
                        </th>
                        <th>Маржа</th>
                        <th>PNL</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((position: OpenedPosition, index: number) =>
                            <tr
                                className={'text'}
                                key={index}
                            >
                                <td className={styles['coin-symbol']}>
                                    <span
                                        className={clsx(
                                            styles['body-label'],
                                            'caption',
                                        )}
                                    >
                                        Символ
                                    </span>
                                    <CoinSymbol
                                        firstCoin='BTC'
                                        secondCoin='USDT'
                                        lever={10}
                                        type='Бессрочные'
                                    />
                                </td>
                                <td className={styles['amount']}>
                                    <span
                                        className={clsx(
                                            styles['body-label'],
                                            'caption',
                                        )}
                                    >Размер
                                    </span>
                                    {/* <SignedNumber
                                        value={position.amount}
                                    /> */}
                                    {(position.amount * 10).toFixed(2)}
                                </td>
                                <td className={styles['entry-price']}>
                                    <span className={clsx(
                                        styles['body-label'],
                                        'caption',
                                    )}
                                    >
                                        Цена входа
                                    </span>
                                    {position.entryPrice}
                                </td>
                                <td className={styles['marked-price']}>
                                    <span
                                        className={clsx(
                                            styles['body-label'],
                                            'caption',
                                        )}
                                    >
                                        Цена маркировки
                                    </span>
                                    {position.markedPrice}
                                </td>
                                {/* <td className={styles['liquidation-price']}>
                                    {position.liquidationPrice}
                                </td> */}
                                <td className={styles['joined-price']}>
                                    <span
                                        className={clsx(
                                            styles['body-label'],
                                            'caption',
                                        )}
                                    >
                                        Цена входа / маркировки 
                                    </span>
                                    {`${position.entryPrice} /
                                    ${position.markedPrice} /`}
                                </td>
                                <td className={styles['margin-cell']}>
                                    <span
                                        className={clsx(
                                            styles['body-label'],
                                            'caption',
                                        )}
                                    >
                                        Маржа
                                    </span>
                                    <div className={styles['margin']}>
                                        <span>{position.amount}</span>
                                        <span>({evaluateMarginType(position.margin.type)})</span>
                                    </div>
                                </td>
                                <td className={styles['PNL']}>
                                    <span
                                        className={clsx(
                                            styles['body-label'],
                                            'caption',
                                        )}
                                    >
                                        PNL
                                    </span>
                                    <SignedNumber
                                        value={(position.PNL)?.toFixed(2)}
                                    />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </>
    );
};

export default OpenedPositions;
