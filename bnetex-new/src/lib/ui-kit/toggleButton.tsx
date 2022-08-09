import { useState } from 'react';

const ToggleButton = props => {
    const [alignment, setAlignment] = useState('left' || props.alignment);

    const handleAlignment = value => {
        setAlignment(value);

        props.handleChange(value);
    }

    const classHandler = type => {
        return ( type == alignment ) ?
            'toggle-type-selector user-selector-field user-selector-field-active' :
            'toggle-type-selector user-selector-field';
    }
    
    return (
        <div
            className={`toggle-type-switcher ${props.className}`}
        >
            <div
                className={classHandler('left')}
                onClick={() => handleAlignment('left')}
            >
                {props.leftField}
            </div>
            <div
                className={classHandler('right')}
                onClick={() => handleAlignment('right')}
            >
                {props.rightField}
            </div>
        </div>
    );
}

export default ToggleButton;