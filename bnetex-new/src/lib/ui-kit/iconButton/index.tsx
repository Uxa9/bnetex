
import classNames from 'classnames';
import styles from './iconButton.module.scss';
import { ButtonHTMLAttributes, FC } from 'react';
import { Spinner } from 'assets/images/icons';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    buttonStyle?: 'default' | 'flat';
    Icon?: ReactSvg;
    isLoading?: boolean;
    mini?: boolean;
}

const Button: FC<IconButtonProps> = props => {

    const {buttonStyle = 'default', Icon, 
        className, isLoading, mini = false, ...rest} = props;

    return (
        <button
            className=
                {
                    classNames(
                        styles['button'],
                        styles[`button_style--${buttonStyle}`],
                        mini && 'button-mini',
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
                    </>
            }
        </button>
    );
};

export default Button;
