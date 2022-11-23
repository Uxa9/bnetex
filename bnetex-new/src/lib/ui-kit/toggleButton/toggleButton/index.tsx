import { FC, InputHTMLAttributes, useMemo } from 'react';
import styles from './toggleButton.module.scss';
import { v4 as uuidV4 } from 'uuid';
import clsx from 'clsx';

export interface ToggleButtonProps extends InputHTMLAttributes<HTMLInputElement> {
    text: string | JSX.Element;
    value: string | number;
    exclusive?: boolean;
    location?: 'left' | 'right' | 'center';
    buttonStyle?: 'outlined' | 'underlined';
    className?: string;
}

const ToggleButton: FC<ToggleButtonProps> = props => {

    const { text, exclusive, location = 'center', buttonStyle = 'outlined', className,  ...rest } = props;
    const inputID = useMemo(() => uuidV4(), []);

    return (
        <>
            <input
                type={exclusive ? 'radio' : 'checkbox'}
                id={inputID}
                onChange={props.onChange}
                className='visually-hidden'
                {...rest}
            />
            <label
                className={clsx(
                    styles.button, 
                    styles[`button--${buttonStyle}`],
                    styles[`button--${location}`],
                    className,
                )}
                htmlFor={inputID}
            >
                {text}
            </label>
        </>

    );
};

export default ToggleButton;
