import React, { FC, InputHTMLAttributes, useState } from 'react';

interface NumInputProps extends InputHTMLAttributes<HTMLInputElement>{
    prefix?: string,
    value?: number,
    suffix?: string  // перфикс надо сделать, чтобы в него можно было передавать элемент
}


const NumInput:FC<NumInputProps> = props => {

    const {value, prefix, suffix} = props;

    const [inputValue, setInputValue] = useState<number | undefined>(value);

    // const sendValue = () => {}

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.valueAsNumber;

        setInputValue(value);
    };

    return (
        <div
            className="number-input-field"
        >
            <span>
                {prefix}
            </span>
            <input
                type="number"
                value={inputValue}
                onChange={handleInput}
            />
            <span>
                {suffix}
            </span>
        </div>
    );
};

export default NumInput;
