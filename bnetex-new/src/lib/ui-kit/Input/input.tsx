import classNames from 'classnames';
import { v4 as uuidV4 } from 'uuid';
import { FC, InputHTMLAttributes, useMemo } from 'react';
import styles from './input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    hasBackground?: boolean
}

// toDo
// Объединить с компонентом numInput

const Input: FC<InputProps> = props => {
    
    const { label, hasBackground, ...rest } = props;

    const id = useMemo(() => uuidV4(), []);

    return(
        <div className={styles['input-wrapper']}>
            {
                label && 
                <label 
                    className={classNames('label-1', styles.label)}
                    htmlFor={id}
                >
                    { label }
                </label>
            }

            <input 
                type="text"
                id={id}
                className={classNames(
                    styles.input,
                    {[styles['input--background']]: hasBackground}
                )}
                {...rest}
            />
        </div>
    );
};

export default Input;
