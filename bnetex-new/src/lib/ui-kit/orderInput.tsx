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

    const MAX_PERCENT_VALUE = 100;

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {

        const inputValue = event.currentTarget.valueAsNumber;

        if (inputValue <= 0) {
            setValue(0);
            return;
        }

        if (suffix === '%') {
            inputValue <= MAX_PERCENT_VALUE ? setValue(inputValue) : setValue(MAX_PERCENT_VALUE);
            return;
        }

        setValue(inputValue);
    };


    // Это что кста?
    useEffect(() => {
        forceSendValue && sendValue(value);
    }, [forceSendValue]);

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
                    onChange={handleInput}
                    className="amount-selector user-selector-field edit-selector-field"
                />
            }
        </>
    );
};

export default OrderInput;
