import _l from '../../locales/index';

import Edit from '../../images/icons/edit';

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
                    className="trade-type-selector"
                >
                    {_l.trade_market}
                </div>
                <div
                    className="trade-type-selector"
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
                            className='money-type-selector'
                        >
                            %
                        </div>
                        <div
                            className='money-type-selector'
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
            </div>
            <div
                className="trade-tpsl-field"
            >
            
            </div>
        </div>
    )
}

export default BeginnerTerminal;