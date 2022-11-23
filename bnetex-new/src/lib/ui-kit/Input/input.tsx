import clsx from 'clsx';
import { v4 as uuidV4 } from 'uuid';
import React, { InputHTMLAttributes, ReactNode, useMemo, useState } from 'react';
import styles from './input.module.scss';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Info, Warning } from 'assets/images/icons';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    hasBackground?: boolean,
    postfix?: ReactNode,
    type?: 'number' | 'text' | 'search' | 'email' | 'password',
    errorText?: string,
    helperText?: string | JSX.Element,
    inputControl?: UseFormRegisterReturn,
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    
    const { hasBackground, type = 'text', errorText, helperText, postfix, inputControl, onFocus, ...rest } = props;
    const label = `${props.label}${props.required ? ' *' : ''}`;
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const id = useMemo(() => uuidV4(), []);
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!event.currentTarget.value) setIsActive(false);
        setIsFocused(false);
        inputControl?.onBlur && inputControl.onBlur(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus && onFocus(event);
        setIsFocused(true);
        setIsActive(true);
    };

    return(
        <div className={clsx(
            styles['input-wrapper'],
            {[styles['input-wrapper--activeOrFilled']]: isActive},
            {[styles['input-wrapper--focused']]: isFocused},
            {[styles['input-wrapper--error']]: errorText},
            {[styles['input-wrapper--with-helper']]: helperText},
        )}
        >
            <label 
                className={clsx(
                    styles.label,
                    'text'
                )}
                htmlFor={id}
            >
                { label }
            </label>
            <div className={styles['input-inner-container']}>
                <input 
                    type={type}
                    id={id}
                    className={clsx(
                        styles.input,
                        'text'
                    )}
                    tabIndex={1}
                    onFocus={handleFocus}
                    ref={ref}
                    onAnimationStart={() => setIsActive(true)}
                    {...inputControl}
                    onBlur={handleBlur}
                    {...rest}
                />
                
                <fieldset className={
                    clsx(
                        styles['fieldset-outline'],
                        {[styles['fieldset-outline--background']]: hasBackground}
                    )}
                >
                    <legend className={styles['fieldset-outline__legend']}>
                        <span>{label}</span>
                    </legend>
                </fieldset>
                {postfix}
            </div>
            <div className={clsx(
                styles['input__helper'],
                errorText && styles['input__helper--error'],
                'caption',
            )}
            >
                {
                    errorText ? 
                        <>
                            <Warning />
                            { errorText }
                        </> : 
                        <>
                            {
                                helperText &&
                            <>
                                { typeof helperText === 'string' && <Info /> }
                                { helperText }
                            </>
                            }
                        </>
                }
            </div>

        </div>
    );
});

export default Input;
