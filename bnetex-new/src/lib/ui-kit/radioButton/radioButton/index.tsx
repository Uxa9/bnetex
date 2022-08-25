import { FC, InputHTMLAttributes, useMemo, useState } from 'react';
import styles from './radioButton.module.scss';
import { v4 as uuidV4 } from 'uuid';
import classNames from 'classnames';

export interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    value: string | number
}

const RadioButton: FC<RadioButtonProps> = props => {

    const { onChange, label, ...rest } = props;

    const inputID = useMemo(() => uuidV4(), []);
    
    return (
        <label
            className={classNames(styles.container)}
            htmlFor={inputID}
        >

            <input
                type="radio"
                id={inputID}
                onChange={props.onChange}
                className='visually-hidden'
                {...rest}
            />

            <div
                className={styles['custom-toggle']}
            >
                <div className={styles.centerpiece}></div>
            </div>

            {label}

        </label>
    );
};

export default RadioButton;
