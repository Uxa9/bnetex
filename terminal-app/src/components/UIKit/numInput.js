import { useState } from 'react';

const NumInput = props => {
    const [value, setValue] = useState(props.value || '')

    // const sendValue = () => {}

    return (
        <div
            className="number-input-field"
        >
            <span>
                {props.prefix}
            </span>
            <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <span>
                {props.suffix}
            </span>
        </div>
    )
}

export default NumInput;