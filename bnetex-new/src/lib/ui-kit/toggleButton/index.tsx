import { FC, InputHTMLAttributes, useMemo } from 'react';
import styles from './toggleButton.module.scss';
import { v4 as uuidV4 } from 'uuid';
import classNames from 'classnames';

export interface ToggleButtonProps extends InputHTMLAttributes<HTMLInputElement> {
    text: string,
    value: string | number,
    exclusive: boolean,
    location?: 'left' | 'right' | 'center'
}

const RadioButton: FC<ToggleButtonProps> = props => {

    const { text, exclusive, location = 'center', ...rest } = props;

    const inputID = useMemo(() => uuidV4(), [])

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
                className={classNames(styles.container, styles[`container--${location}`])}
                htmlFor={inputID}
            >
                {text}
            </label>
        </>

    )
}

export default RadioButton;