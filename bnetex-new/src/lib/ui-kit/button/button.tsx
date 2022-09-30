
import classNames from 'classnames';
import styles from './button.module.scss';
import { ButtonHTMLAttributes, FC, useEffect } from 'react';
import { Spinner } from 'assets/images/icons';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    buttonStyle?: 'primary' | 'secondary' | 'accept' | 'decline' | 'thin' | 'stroke';
    Icon?: ReactSvg;
    iconAlignment?: 'left' | 'right';
    text?: string;
    fillContainer?: boolean;
    isLoading?: boolean;
}

const Button: FC<ButtonProps> = props => {

    // Достаем пропсы и назначаем дефолтные значения, если ничего не передано
    const {buttonStyle = 'primary', Icon, text, iconAlignment='left', 
        className, fillContainer = false, isLoading, ...rest} = props;

    return (
        <button
            className=
                {
                    classNames(
                        styles['button'],
                        styles[`button_style--${buttonStyle}`],
                        styles[`button_align--${iconAlignment}`],
                        fillContainer && styles['button--fill-container'],
                        className)
                }
            {...rest}
        >
            {
                isLoading ?
                    <Spinner 
                        className={styles.spinner}
                    />
                    :
                    <>
                        {Icon && <Icon />}
                        {text && text}
                    </>
            }
        </button>
    );
};

export default Button;
