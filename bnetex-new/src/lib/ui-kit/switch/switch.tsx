import { InputHTMLAttributes, useMemo } from 'react';
import styles from './switch.module.scss';
import { v4 as uuidV4 } from 'uuid';
import clsx from 'clsx';

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    justify?: 'gap' | 'space-between';
}

const Switch = ({label, className, justify = 'space-between', ...rest}: SwitchProps) => {

    const switchID = useMemo(() => uuidV4(), []);

    return (
        <div
            className={clsx(
                styles['switch-container'],
                styles[`switch-container--${justify}`],
                className
            )}
        >
            <label
                className={clsx(
                    styles['switch-container__label'],
                    'text'
                )}
                htmlFor={switchID}
            >
                {label}
            </label>
            <input
                className={'visually-hidden'}
                type={'checkbox'}
                id={switchID}
                {...rest}
            />
            <label
                className={styles['custom-switch-checkbox']}
                htmlFor={switchID}
            >
                <div></div>
            </label>
        </div>
    );
};

export default Switch;
