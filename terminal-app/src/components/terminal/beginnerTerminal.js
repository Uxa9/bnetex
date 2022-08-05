import Button     from '../common/button';
import OrderInput from './orderInput';

import Edit from '../../images/icons/edit';

import _l from '../../locales/index';

const BeginnerTerminal = props => {

    return (
        <div
            className="block beginner-terminal"
        >
            <div
                className="margin-and-lever-selector"
            >
                <div 
                    className="selector-select-button"
                    onClick={props.evokeMarginSelector}
                >
                    {_l[`margin_${props.margin}`]}
                </div>
                <div 
                    className="selector-select-button"
                    onClick={props.evokeLeverSelector}
                >
                    {`${props.lever}x`}
                </div>
            </div>
            <div
                className="trade-type"
            >
                <div
                    className="trade-type-selector 
                        user-selector-field
                        user-selector-field-active"
                >
                    {_l.trade_market}
                </div>
                <div
                    className="trade-type-selector 
                        user-selector-field"
                >
                    {_l.trade_tpsl}
                </div>
            </div>
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
                            {`10 000 USDT`}
                        </b>
                    </div>
                    <div>
                        <span>
                            {`${_l.maximum} - `}
                        </span>
                        <b>
                            {`100 000 USDT`}
                        </b>
                    </div>
                </div>
                <input
                    type="number"
                    placeholder={_l.price}
                />
                <input
                    type="number"
                    placeholder={_l.amount}
                />
                <div
                    className='money-type-switcher-and-edit'
                >
                    <div
                        className='money-type-switcher'
                    >
                        <div
                            className='money-type-selector 
                                user-selector-field'
                        >
                            %
                        </div>
                        <div
                            className='money-type-selector 
                                user-selector-field'
                        >
                            $
                        </div>
                    </div>
                    <div
                        className='money-type-edit'
                    >
                        <Edit 
                            width='20px'
                            height='20px'
                        />
                    </div>
                </div>
                <div
                    className="percent-selector"
                >
                    <OrderInput
                        
                    />
                    <div
                        className="amount-selector user-selector-field"
                    >
                        5%
                    </div>
                    <div
                        className="amount-selector user-selector-field"
                    >
                        10%
                    </div>
                    <div
                        className="amount-selector user-selector-field"
                    >
                        50%
                    </div>
                    <div
                        className="amount-selector user-selector-field"
                    >
                        100%
                    </div>
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
            <div
                className="trade-tpsl-field"
            >
            
            </div>
        </div>
    )
}

export default BeginnerTerminal;