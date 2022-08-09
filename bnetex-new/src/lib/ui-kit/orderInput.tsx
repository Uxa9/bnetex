import { useState, useEffect, FC } from 'react';

interface OrderInputProps {
    suffix: '$' | '%',
    prop_value?: number,
    forceSendValue: boolean,
    sendValue: (value: number) => void,
    mode: 'view' | 'edit'
}

const OrderInput: FC<OrderInputProps> = props => {

    const { suffix, prop_value, forceSendValue, sendValue, mode } = props;

    const [value, setValue] = useState<number>(prop_value || 1);

    const changeInputValue = (value: number) => {

        if (value <= 0) {
            setValue(0);
            return;
        }

        if (suffix === '%') {
            value <= 100 ? setValue(value) : setValue(100);
            return;
        }

        setValue(value);
    }


    // Это что кста?
    useEffect(() => {
        forceSendValue && sendValue(value);
    }, [forceSendValue])

    return (
        <>
            {mode === 'view' ?
                <div
                    className="amount-selector user-selector-field"
                >
                    {`${value}${suffix}`}
                </div>
                :
                <input
                    value={value}
                    type={'number'}
                    onChange={e => changeInputValue(e.target.value)}
                    className="amount-selector user-selector-field edit-selector-field"
                />
            }
        </>
    );
}

export default OrderInput;