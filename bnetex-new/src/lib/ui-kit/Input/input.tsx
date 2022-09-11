import classNames from 'classnames';
import { v4 as uuidV4 } from 'uuid';
import React, { FC, InputHTMLAttributes, ReactNode, useMemo, useState } from 'react';
import styles from './input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    hasBackground?: boolean,
    postfix?: ReactNode,
    type?: 'number' | 'text' | 'search' | 'email',
    errorText?: string,
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    
    const { hasBackground, type = 'text', errorText, postfix, ...rest } = props;

    const label = `${props.label}${props.required ? ' *' : ''}`;

    const [isActive, setIsActive] = useState<boolean>(false);

    const id = useMemo(() => uuidV4(), []);
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!event.currentTarget.value) setIsActive(false);
    };

    return(
        <div className={classNames(
            styles['input-wrapper'],
            {[styles['input-wrapper--activeOrFilled']]: isActive},
            {[styles['input-wrapper--error']]: errorText}
        )}
        >
            <label 
                className={styles.label}
                htmlFor={id}
            >
                { label }
            </label>
            <div className={styles['input-inner-container']}>
                <input 
                    type={type}
                    id={id}
                    className={classNames(
                        styles.input,
                        {[styles['input--background']]: hasBackground}
                    )}
                    {...rest}
                    tabIndex={1}
                    onFocus={() => setIsActive(true)}
                    onBlur={handleBlur}
                    ref={ref}
                />
                
                <fieldset className={styles['fieldset-outline']}>
                    <legend className={styles['fieldset-outline__legend']}>
                        <span>{label}</span>
                    </legend>
                </fieldset>

                {postfix}

            </div>
            <div className={styles['error-text']}>
                {errorText}
            </div>
        </div>
    );
});

export default Input;
