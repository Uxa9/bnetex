import { Check, Cross } from 'assets/images/icons';
import clsx from 'clsx';
import { TextIcon } from 'lib/ui-kit';
import { MIN_PASSWORD_LENGTH } from 'lib/utils/hookFormValidation';
import { useEffect, useState } from 'react';
import styles from './passwordValidator.module.scss';

interface PasswordValidation {
    atleastEight: boolean;
    atleastOneDigit: boolean;
    atleactOneUppercase: boolean;
}

const defaultPasswordValidation: PasswordValidation = {
    atleastEight: false,
    atleastOneDigit: false,
    atleactOneUppercase: false,
};

interface PasswordValidatorProps {
   inputValue: string,
   isVisible: boolean,
}

const PasswordValidator = ({ inputValue, isVisible }:PasswordValidatorProps) => { 

    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>(defaultPasswordValidation);

    useEffect(() => {
        checkValidity(inputValue);
    }, [ inputValue ]);

    const checkValidity = (value: string) => {
        setPasswordValidation({
            atleastEight: value.length >= MIN_PASSWORD_LENGTH,
            atleastOneDigit: /\d/.test(value),
            atleactOneUppercase: /[A-ZА-Я]/.test(value),
        });
    };

    return(
        <div 
            className={clsx(
                styles['password-validator'],
                isVisible && styles['password-validator--visible'],
            )}
        >
            <TextIcon 
                label='Минимум 8 символов'
                Icon={passwordValidation.atleastEight ? Check : Cross}
                className={clsx(
                    styles['password-validator__item'],
                    passwordValidation.atleastEight && styles['password-validator__item--valid']
                )}
            />
            <TextIcon 
                label='Хотя бы 1 цифра'
                Icon={passwordValidation.atleastOneDigit ? Check : Cross}
                className={clsx(
                    styles['password-validator__item'],
                    passwordValidation.atleastOneDigit && styles['password-validator__item--valid']
                )}
            />
            <TextIcon 
                label='Хотя бы 1 заглавная буква'
                Icon={passwordValidation.atleactOneUppercase ? Check : Cross}
                className={clsx(
                    styles['password-validator__item'],
                    passwordValidation.atleactOneUppercase && styles['password-validator__item--valid']
                )}
            />
        </div>
    );
};

export default PasswordValidator;
