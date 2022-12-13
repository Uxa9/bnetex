import { ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
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

    const [futuresWallet, setFuturesWallet] = useState<Number>(0);
    const [viewType, setViewType] = useState<TraderViewType>('limit');
    const [sumType, setSumType] = useState<TraderSumType>('exactSum');
    const [orderBook, setOrderBook] = useState<any>([]);
    const [leverage, setLeverage] = useState<number>(0);
    const [isolated, setIsolated] = useState<boolean>(false);

    const { dates, roe, pnl, loading } = useTypedSelector(state => state.roePnl);

    const { open: OpenMarginModal } = useModal(MarginPopUp);
    const { open: OpenLeverModal } = useModal(LeverPopUp);

    // const orderBookSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth20@1000ms');
    //
    // orderBookSocket.onmessage = (event) => {
    //     console.log(JSON.parse(event.data));
    //
    //     let data = JSON.parse(event.data);
    //
    //     setOrderBook([...data.bids, ...data.asks]);
    // }
   
    const onSubmit = (data: TradeFormData) => {
        console.log(data);
        
    }

    const [tradeType, setTradeType] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        sendFuturesOrder({
            side: tradeType,
            type: "MARKET",
            amount: amount
        });
    }, [tradeType]);

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
    }, []);

    return (
        <div
            className={clsx(styles['trade-layout'])}
        >
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
                {
                    orderBook.map((item: (boolean | ReactChild | ReactFragment | ReactPortal | null | undefined)[]) => {
                        return (
                            <div
                                className={clsx(styles['cup-position'])}
                                onClick={() => {

                                }}
                            >
                                <span>
                                    {item[1]}
                                </span>
                                <span>
                                    {item[0]}
                                </span>
                            </div>
                        )
                    })
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
                    />
                    <Input
                        label={"Количество"}
                        postfix={"USDT"}
                        onChange={(e) => setAmount(Number(e.target.value))}
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
                            />
                            <ToggleButton
                                text={'5$'}
                                value={'5'}
                            />
                            <ToggleButton
                                text={'10$'}
                                value={'10'}
                            />
                            <ToggleButton
                                text={'50$'}
                                value={'50'}
                            />
                            <ToggleButton
                                text={'100$'}
                                value={'100'}
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
                            />
                            <ToggleButton
                                text={'5%'}
                                value={'5'}
                            />
                            <ToggleButton
                                text={'10%'}
                                value={'10'}
                            />
                            <ToggleButton
                                text={'50%'}
                                value={'50'}
                            />
                            <ToggleButton
                                text={'100%'}
                                value={'100'}
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
