
import classNames from 'classnames';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    buttonStyle?: 'primary' | 'secondary' | 'accept' | 'decline',
    width?: string,
    height?: string,
    children?: ReactNode
}

/**
 * Компонент кнопки
 * @param {String} type - тип кнопки:
 *  primary (default), secondary, accept, decline
 * @param {Number} width - ширина кнопки
 * @param {Number} height - высота кнопки
 */

// toDo
// Убрать инлайновые стили!!
// Добавить возможность иконок

const Button: FC<ButtonProps> = props => {

    const {width, height, children, buttonStyle, className} = props;

    return (
        <button
            className={
                classNames(
                    'button',
                    `button-${buttonStyle || 'primary'}`,
                    className)}
            style={{
                width  : width  || '200px',
                height : height || '50px',
            }}
        >
            {children}
        </button>
    );
};

export default Button;
