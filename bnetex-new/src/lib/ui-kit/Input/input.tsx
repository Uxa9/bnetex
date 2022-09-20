import classNames from 'classnames';
import { v4 as uuidV4 } from 'uuid';
import React, { InputHTMLAttributes, ReactNode, useMemo, useState } from 'react';
import styles from './input.module.scss';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    hasBackground?: boolean,
    postfix?: ReactNode,
    type?: 'number' | 'text' | 'search' | 'email',
    errorText?: string,
    inputControl?: UseFormRegisterReturn
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    
    const { hasBackground, type = 'text', errorText, postfix, inputControl, ...rest } = props;
    const label = `${props.label}${props.required ? ' *' : ''}`;
    const [isActive, setIsActive] = useState<boolean>(false);
    const id = useMemo(() => uuidV4(), []);
    
    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!event.currentTarget.value) setIsActive(false);
        props.onBlur && props.onBlur(event);
        inputControl?.onBlur && inputControl.onBlur(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(event);
        inputControl?.onChange && inputControl.onChange(event);
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
                    className={styles.input}
                    tabIndex={1}
                    onFocus={() => setIsActive(true)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name={inputControl?.name}
                    ref={ref}
                    {...rest}
                />
                
                <fieldset className={
                    classNames(
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
            <div className={styles['error-text']}>
                {errorText}
            </div>
        </div>
    );
});

export default Input;
