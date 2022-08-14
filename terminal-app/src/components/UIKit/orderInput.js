import { useState, useEffect } from 'react';

const OrderInput = props => {
    const [value, setValue] = useState(props.value || 1);

    const changeInputValue = newValue => {
        const formatValue = parseInt(newValue, 10);

        if ( props.suffix == '%' ) {
            if ( formatValue <= 0 || isNaN(formatValue) ) {
                setValue(0);
                return;
            }
    
            formatValue <= 100 ? setValue(formatValue) : setValue(100);
        }

        if ( props.suffix == '$' ) {
            if ( formatValue <= 0 || isNaN(formatValue) ) {
                setValue(0);
                return;
            }

            setValue(formatValue);
        }
    }

    useEffect(() => {
        props.forceSendValue == true && props.sendValue(value);
    }, [props.forceSendValue])

    return (
        <>
            { props.mode == 'view' && 
                <div
                    className="amount-selector user-selector-field disable-selection"
                >
                    {`${value}${props.suffix || ''}`}
                </div>
            }
            { props.mode == 'edit' && 
                <input
                    value={value}
                    onChange={e => changeInputValue(e.target.value)}
                    className="amount-selector user-selector-field edit-selector-field"
                />
            }
        </>
    );
}

export default OrderInput;