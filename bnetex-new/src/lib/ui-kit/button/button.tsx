
import classNames from 'classnames';
import styles from './button.module.scss';
import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    buttonStyle?: 'primary' | 'secondary' | 'accept' | 'decline' | 'disabled' | 'thin' | 'stroke',
    Icon?: ReactSvg;
    iconAlignment?: 'left' | 'right'
    text?: string
}

const Button: FC<ButtonProps> = props => {

    // Достаем пропсы и назначаем дефолтные значения, если ничего не передано
    const {buttonStyle = 'primary', Icon, text, iconAlignment='left', className, ...rest} = props;

    return (
        <button
            className=
                {
                    classNames(
                        styles['button'],
                        styles[`button_style--${buttonStyle}`],
                        styles[`button_align--${iconAlignment}`],
                        className)
                }
            {...rest}
        >
            {Icon && <Icon />}
            {text && text}
        </button>
    );
};

export default Button;
