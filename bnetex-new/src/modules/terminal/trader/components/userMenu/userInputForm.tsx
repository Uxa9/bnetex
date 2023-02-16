import clsx from "clsx";
import { useModal } from "lib/hooks/useModal";
import { Button, Input, ToggleButton, ToggleButtonGroup } from "lib/ui-kit";
import { useState } from "react";
import { sendFuturesOrder } from "services/trading/sendFuturesOrder";
import LeverPopUp from "../modals/leverPopUp";
import MarginPopUp from "../modals/marginPopUp";
import styles from './userMenu.module.scss';

type TraderViewType = 'limit' | 'tpsl';
type TraderSumType  = 'exactSum' | 'percent';

interface TradeType {
    name: string,
    key: TraderViewType
}

interface TraderSum {
    type: string,
    key: TraderSumType
}

interface TraderExactSum {
    text: string,
    sum: number
}

interface TraderPercentSum {
    text: string,
    percent: number
}

const UserInputForm = () => {

    const { open: OpenMarginModal } = useModal(MarginPopUp);
    const { open: OpenLeverModal } = useModal(LeverPopUp);
    
    const [futuresWallet, setFuturesWallet] = useState<number>(0);
    const [viewType, setViewType] = useState<TraderViewType>('limit');
    const [sumType, setSumType] = useState<TraderSumType>('exactSum');
    const [limitPrice, setLimitPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    const [tradeType, setTradeType] = useState('BUY');
    
    // convert to context
    const [leverage, setLeverage] = useState<number>(0);
    const [isolated, setIsolated] = useState<boolean>(false);

    const TradeTypes: TradeType[] = [
        {
            name: "Маркет/Лимит",
            key: "limit"
        },
        {
            name: "TP/SL",
            key: "tpsl"
        }
    ];

    const TraderSumInputs: TraderSum[] = [
        {
            type: "$",
            key: "exactSum"
        },
        {
            type: "%",
            key: "percent"
        }
    ];

    // get from user settings context
    const TraderExactSumArr: TraderExactSum[] = [
        {
            text: '1$',
            sum: 1
        },
        {
            text: '5$',
            sum: 5
        },
        {
            text: '10$',
            sum: 10
        },
        {
            text: '50$',
            sum: 50
        },
        {
            text: '100$',
            sum: 100
        },
    ];

    // same
    const TraderPercentSumArr: TraderPercentSum[] = [
        {
            text: '1%',
            percent: 1
        },
        {
            text: '5%',
            percent: 5
        },
        {
            text: '10%',
            percent: 10
        },
        {
            text: '50%',
            percent: 50
        },
        {
            text: '100%',
            percent: 100
        },
    ];

    const sendOrder = (type: string, side: string) => {
        // if (limitPrice !== 0) {
        //     sendFuturesOrder({
        //         side: side,
        //         type: 'LIMIT',
        //         price: limitPrice,
        //         amount: amount,
        //         pair: pair,
        //     });
        // } else {
        //     sendFuturesOrder({
        //         side: side,
        //         type: type,
        //         amount: amount,
        //         pair: pair,
        //     });
        // }
    };

    return (
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
                        OpenMarginModal({ isolated: isolated });
                    }}
                />
                <Button
                    buttonStyle="secondary"
                    text={`${leverage}x`}
                    onClick={(e) => {
                        e.preventDefault();
                        OpenLeverModal({ lever: leverage });
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
                    {TradeTypes.map((type: TradeType) => {
                        return (
                            <ToggleButton
                                text={type.name}
                                value={type.key}
                            />
                        )
                    })}
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
                    {TraderSumInputs.map((input: TraderSum) => {
                        return (
                            <ToggleButton
                                text={input.type}
                                value={input.key}
                            />
                        )
                    })}
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
                            onChange={(value) => setAmount(value)}
                            value={sumType}
                        >
                            {TraderExactSumArr.map((item: TraderExactSum) => {
                                return (
                                    <ToggleButton
                                        text={item.text}
                                        value={item.sum}
                                    />
                                )
                            })}
                        </ToggleButtonGroup> :
                        <ToggleButtonGroup
                            title={''}
                            name={'trader_sum'}
                            onChange={(value) => setAmount((value / (futuresWallet || 1) * 100))}
                            value={sumType}
                        >
                            {TraderPercentSumArr.map((item: TraderPercentSum) => {
                                return (
                                    <ToggleButton
                                        text={item.text}
                                        value={item.percent}
                                    />
                                )
                            })}
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
    )
}

export default UserInputForm;