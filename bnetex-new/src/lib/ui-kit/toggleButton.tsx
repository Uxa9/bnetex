import classNames from 'classnames';
import { FC, useState } from 'react';

interface ToggleButtonProps{
    alignment?: AlignmentType,
    handleChange: (value: any) => void,
    className: string,
    leftField: any,
    rightField: any
}

type AlignmentType = 'left' | 'right'

// toDo
// Разобрать компонент на toggleButton и toggleButtonGroup (как на mui)
// убрать непонятные пропсы
// переезд на scss модули

const ToggleButton:FC<ToggleButtonProps> = props => {

    const [alignment, setAlignment] = useState<AlignmentType>('left' || props.alignment);

    const handleAlignment = (alignment: AlignmentType) => {
        setAlignment(alignment);

        // Это что такое???
        props.handleChange(alignment);
    };

    const fieldClass = 'toggle-type-selector user-selector-field';
    
    return (
        <div
            className={`toggle-type-switcher ${props.className}`}
        >
            <div
                className={classNames(
                    fieldClass,
                    {'user-selector-field-active': alignment === 'left'}
                )}
                onClick={() => handleAlignment('left')}
            >
                {props.leftField}
            </div>
            <div
                className={classNames(
                    fieldClass,
                    {'user-selector-field-active': alignment === 'right'}
                )}
                onClick={() => handleAlignment('right')}
            >
                {props.rightField}
            </div>
        </div>
    );
};

export default ToggleButton;
