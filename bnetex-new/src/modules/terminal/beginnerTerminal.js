import { useState } from 'react';

import { Button, OrderInput, ToggleButton, NumInput } from '../../lib/ui-kit';
import LeverPopUp  from '../../components/leverPopUp';
import MarginPopUp from '../../components/marginPopUp';

import _l from '../../locales/index';
import { Edit, Info } from 'assets/images/icons';

// toDo
// декомпозировать, перенести на tsx

const BeginnerTerminal = props => {

    const [mode, setMode]           = useState('view');
    const [tradeMode, setTradeMode] = useState('percent');
    const [margin, setMargin]       = useState('cross');
    const [lever, setLever]         = useState(20);
    const [tradeType, setTradeType] = useState('market');

    const [forceSendValue, setForceSendValue]       = useState(false);
    const [userPercentValues, setUserPercentValues] = useState([1, 5, 10, 50, 100]);
    const [userAmountValues, setUserAmountValues]   = useState([1, 15, 10, 50, 100]);
    const [userTPSLValues, setUserTPSLValues]       = useState([1, '3/1', '5/1', '10/1']);

    const [marginPopUp, showMarginPopUp] = useState(false);
    const [leverPopUp,  showLeverPopUp]  = useState(false);

    const acceptMarginPopUp = margin => {
        setMargin(margin);
        showMarginPopUp(false);
    };

    const closeMarginPopUp = () => {
        showMarginPopUp(false);
    };

    const acceptLeverPopUp = lever => {
        setLever(lever);
        showLeverPopUp(false);
    };

    const closeLeverPopUp = () => {
        showLeverPopUp(false);
    };

    const inputChangeHandler = async () => {
        await setForceSendValue(true);
        setForceSendValue(false);
        setMode('view');
    };

    const moneySwitchHandler = value => {
        if (value == 'left') {
            setTradeMode('percent');
            return;
        }

        if (value == 'right') {
            setTradeMode('amount');
            return;
        }
    };

    const tradeTypeChangeHandler = value => {
        if (value == 'left') {
            setTradeType('market');
            return;
        }

        if (value == 'right') {
            setTradeType('tpsl');
            return;
        }
    };

    const getDataFromInput = (value, n, type) => {
        let newValues = type == 'precent' ?
            userPercentValues :
            userAmountValues;
        
        newValues[n] = value;

        type === 'percent' ? 
            localStorage.setItem('percent', newValues) :
            localStorage.setItem('amount', newValues);

        // type == 'percent' ? 
        //     setUserPercentValues(newValues) :
        //     setUserAmountValues(newValues);

        if (type == 'percent') {
            setUserPercentValues(newValues);
        }

        if (type == 'amount') {
            setUserAmountValues(newValues);
        }
    };

    const takeProfitText = () => {
        return (
            <>
                <span>
                    {_l.when}
                </span>
                <b
                    className="pnl-text-bold"
                >
                    {` ${_l.mark_price_lc} `}
                </b>
                <span>
                    {_l.reach}
                </span>
                <b
                    className="pnl-text-bold"
                >
                    {' 19000.00 '/* mark price */}
                </b>
                <span>
                    {_l.take_profit_text}
                </span>
                <span
                    className="positive"
                >
                    {' 2.28'/* PnL */}
                </span>
            </>
        );
    };

    const stopLossText = () => {
        return (
            <>
                <span>
                    {_l.when}
                </span>
                <b
                    className="pnl-text-bold"
                >
                    {` ${_l.mark_price_lc} `}
                </b>
                <span>
                    {_l.reach}
                </span>
                <b
                    className="pnl-text-bold"
                >
                    {' 19000.00 '/* mark price */}
                </b>
                <span>
                    {_l.take_profit_text}
                </span>
                <span
                    className="negative"
                >
                    {' -2.28'/* PnL */}
                </span>
            </>
        );
    };

    return (
        <>
            {marginPopUp &&
                <MarginPopUp
                    acceptFunc={acceptMarginPopUp}
                    closeFunc={closeMarginPopUp}
                    type={margin}
                />
            }
            {leverPopUp &&
                <LeverPopUp
                    acceptFunc={acceptLeverPopUp}
                    closeFunc={closeLeverPopUp}
                    lever={lever}
                />
            }
            <div
                className="block beginner-terminal"
            >
                <div
                    className="margin-and-lever-selector"
                >
                    <div 
                        className="selector-select-button"
                        onClick={() => showMarginPopUp(true)}
                    >
                        {_l[`margin_${margin}`]}
                    </div>
                    <div 
                        className="selector-select-button"
                        onClick={() => showLeverPopUp(true)}
                    >
                        {`${lever}x`}
                    </div>
                </div>
                <div
                    className="trade-type-and-tooltip"
                >
                    <ToggleButton
                        className="trade-type"
                        leftField={_l.trade_market}
                        rightField={_l.trade_tpsl}
                        handleChange={tradeTypeChangeHandler}
                    />
                    {
                        tradeType == 'tpsl' &&
                        <div
                            className="tpsl-tooltip"
                        >
                            <span>
                                Что такое TP/SL
                            </span>
                            <Info 
                                width="25px"
                                height="25px"
                            />
                        </div>
                    }
                </div>
                {
                    tradeType == 'market' &&
                    <div
                        className="trade-market-field"
                    >
                        <div
                            className="trade-market-user-wallet"
                        >
                            <div>
                                <span>
                                    {`${_l.available} - `}
                                </span>
                                <b>
                                    {'10 000 USDT'}
                                </b>
                            </div>
                            <div>
                                <span>
                                    {`${_l.maximum} - `}
                                </span>
                                <b>
                                    {'100 000 USDT'}
                                </b>
                            </div>
                        </div>
                        {/* <input
                            type="number"
                            placeholder={_l.price}
                        /> */}
                        <NumInput
                            prefix={_l.amount}
                            suffix={'USDT'}
                        />
                        <div
                            className='money-type-switcher-and-edit'
                        >
                            <ToggleButton
                                className='money-type-switcher'
                                leftField={'%'}
                                rightField={'$'}
                                handleChange={moneySwitchHandler}
                            />
                            <div
                                className="edit-mode-menu"
                            >
                                <div
                                    className={mode == 'edit' ? 
                                        'money-type-edit money-type-edit-active' : 
                                        'money-type-edit'
                                    }
                                    onClick={() => setMode('edit')}
                                >
                                    <Edit 
                                        width='20px'
                                        height='20px'
                                    />
                                </div>
                                { mode == 'edit' &&
                                    <>
                                        <span
                                            className="save-button"
                                            onClick={inputChangeHandler}
                                        >
                                            Сохранить
                                        </span>
                                        <span
                                            className="cancel-button"
                                            onClick={() => setMode('view')}
                                        >
                                            Отменить
                                        </span>
                                    </>
                                }
                            </div>
                        </div>
                        <div
                            className="user-values-selector"
                        >
                            {
                                tradeMode == 'percent' &&
                                <>
                                    <OrderInput
                                        mode={mode}
                                        value={userPercentValues[0]}
                                        suffix="%"
                                        sendValue={(value) => getDataFromInput(value, 0, 'percent')}
                                        forceSendValue={forceSendValue}
                                    />                    
                                    <OrderInput
                                        mode={mode}
                                        value={userPercentValues[1]}
                                        suffix="%"
                                        sendValue={(value) => getDataFromInput(value, 1, 'percent')}
                                        forceSendValue={forceSendValue}
                                    />
                                    <OrderInput
                                        mode={mode}
                                        value={userPercentValues[2]}
                                        suffix="%"
                                        sendValue={(value) => getDataFromInput(value, 2, 'percent')}
                                        forceSendValue={forceSendValue}
                                    />
                                    <OrderInput
                                        mode={mode}
                                        value={userPercentValues[3]}
                                        suffix="%"
                                        sendValue={(value) => getDataFromInput(value, 3, 'percent')}
                                        forceSendValue={forceSendValue}
                                    />
                                    <OrderInput
                                        mode={mode}
                                        value={userPercentValues[4]}
                                        suffix="%"
                                        sendValue={(value) => getDataFromInput(value, 4, 'percent')}
                                        forceSendValue={forceSendValue}
                                    />
                                </>
                            }
                            {
                                tradeMode == 'amount' &&
                                <>
                                    <OrderInput
                                        mode={mode}
                                        value={userAmountValues[0]}
                                        suffix="$"
                                        sendValue={(value) => getDataFromInput(value, 0, 'amount')}
                                        forceSendValue={forceSendValue}
                                    />                    
                                    <OrderInput
                                        mode={mode}
                                        value={userAmountValues[1]}
                                        suffix="$"
                                        sendValue={(value) => getDataFromInput(value, 1, 'amount')}
                                        forceSendValue={forceSendValue}
                                    />
                                    <OrderInput
                                        mode={mode}
                                        value={userAmountValues[2]}
                                        suffix="$"
                                        sendValue={(value) => getDataFromInput(value, 2, 'amount')}
                                        forceSendValue={forceSendValue}
                                    />
                                    <OrderInput
                                        mode={mode}
                                        value={userAmountValues[3]}
                                        suffix="$"
                                        sendValue={(value) => getDataFromInput(value, 3, 'amount')}
                                        forceSendValue={forceSendValue}
                                    />
                                    <OrderInput
                                        mode={mode}
                                        value={userAmountValues[4]}
                                        suffix="$"
                                        sendValue={(value) => getDataFromInput(value, 4, 'amount')}
                                        forceSendValue={forceSendValue}
                                    />
                                </>
                            }
                        </div>
                        {/* <div
                            className="money-selector"
                        >
                            <div
                                className="amount-selector user-selector-field"
                            >
                                1$
                            </div>
                            <div
                                className="amount-selector user-selector-field"
                            >
                                5$
                            </div>
                            <div
                                className="amount-selector user-selector-field"
                            >
                                10$
                            </div>
                            <div
                                className="amount-selector user-selector-field"
                            >
                                50$
                            </div>
                            <div
                                className="amount-selector user-selector-field"
                            >
                                100$
                            </div>
                        </div> */}
                        <div
                            className="buy-and-sell-buttons"
                        >
                            <Button
                                type='accept'
                                width="190px"
                            >
                                {_l.buy_long}
                            </Button>
                            <Button
                                type='decline'
                                width="190px"
                            >
                                {_l.sell_short}
                            </Button>
                        </div>
                        <div
                            className="final-price-calculations"
                        >
                            <div
                                className="long-calculations"
                            >
                                <div
                                    className="liquidation-price"
                                >
                                    <span>
                                        {_l.liquidation_price}
                                    </span>
                                    <span>
                                        --
                                    </span>
                                </div>
                                <div
                                    className="price-cost"
                                >
                                    <span>
                                        {_l.price_cost}
                                    </span>
                                    <span>
                                        100.00 USDT
                                    </span>
                                </div>
                                <div
                                    className="max-price"
                                >
                                    <span>
                                        {_l.price_max}
                                    </span>
                                    <span>
                                        100 000.00 USDT
                                    </span>
                                </div>
                            </div>
                            <div
                                className="short-calculations"
                            >
                                <div
                                    className="liquidation-price"
                                >
                                    <span>
                                        {_l.liquidation_price}
                                    </span>
                                    <span>
                                        --
                                    </span>
                                </div>
                                <div
                                    className="price-cost"
                                >
                                    <span>
                                        {_l.price_cost}
                                    </span>
                                    <span>
                                        100.00 USDT
                                    </span>
                                </div>
                                <div
                                    className="max-price"
                                >
                                    <span>
                                        {_l.price_max}
                                    </span>
                                    <span>
                                        100 000.00 USDT
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {
                    tradeType == 'tpsl' &&
                    <div
                        className="trade-tpsl-field"
                    >
                        <div
                            className="trade-tpsl-info"
                        >
                            <p
                                className="trade-tpsl-info-row"
                            >
                                <span>
                                    {_l.futures}
                                </span>
                                <span>
                                    {`BTC/USDT ${_l.perpetual} / ${_l.long} 10х`}
                                </span>
                            </p>
                            <p
                                className="trade-tpsl-info-row"
                            >
                                <span>
                                    {`${_l.entry_price} (USDT)`}
                                </span>
                                <span>
                                    19190.00
                                </span>
                            </p>
                            <p
                                className="trade-tpsl-info-row"
                            >
                                <span>
                                    {`${_l.mark_price} (USDT)`}
                                </span>
                                <span>
                                    19174.40
                                </span>
                            </p>
                        </div>
                        <div
                            className='tspl-selector-and-edit'
                        >
                            <div
                                className="user-values-selector"
                            >
                                <OrderInput
                                    mode={mode}
                                    value={userTPSLValues[0]}
                                    suffix="%"
                                    sendValue={(value) => getDataFromInput(value, 0, 'tpsl-pair')}
                                    forceSendValue={forceSendValue}
                                />                    
                                <OrderInput
                                    mode={mode}
                                    value={userTPSLValues[1]}
                                    sendValue={(value) => getDataFromInput(value, 1, 'tpsl-pair')}
                                    forceSendValue={forceSendValue}
                                />
                                <OrderInput
                                    mode={mode}
                                    value={userTPSLValues[2]}
                                    sendValue={(value) => getDataFromInput(value, 2, 'tpsl-pair')}
                                    forceSendValue={forceSendValue}
                                />
                                <OrderInput
                                    mode={mode}
                                    value={userTPSLValues[3]}
                                    sendValue={(value) => getDataFromInput(value, 3, 'tpsl-pair')}
                                    forceSendValue={forceSendValue}
                                />
                            </div>
                            <div
                                className="edit-mode-menu"
                            >
                                <div
                                    className={mode == 'edit' ? 
                                        'money-type-edit money-type-edit-active' : 
                                        'money-type-edit'
                                    }
                                    onClick={() => setMode('edit')}
                                >
                                    <Edit 
                                        width='20px'
                                        height='20px'
                                    />
                                </div>
                                { mode == 'edit' &&
                                    <>
                                        <span
                                            className="save-button"
                                            onClick={inputChangeHandler}
                                        >
                                            Сохранить
                                        </span>
                                        <span
                                            className="cancel-button"
                                            onClick={() => setMode('view')}
                                        >
                                            Отменить
                                        </span>
                                    </>
                                }
                            </div>
                        </div>
                        <div
                            className="tpsl-input-fields"
                        >
                            <NumInput
                                prefix={_l.take_profit}
                                suffix={'USDT'}
                            />
                            <p
                                className="pnl-text"
                            >
                                {takeProfitText()}
                            </p>
                            <NumInput
                                prefix={_l.stop_loss}
                                suffix={'USDT'}
                            />
                            <p
                                className="pnl-text"
                            >
                                {stopLossText()}
                            </p>
                        </div>
                        <Button
                            width="100%"
                        >
                            {_l.confirm}
                        </Button>
                    </div>
                }
            </div>
        </>
    );
};

export default BeginnerTerminal;
