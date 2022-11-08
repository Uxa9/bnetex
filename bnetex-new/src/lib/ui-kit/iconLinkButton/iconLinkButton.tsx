import classNames from 'classnames';
import { AppColorsType } from 'lib/types/appColors';
import { ButtonHTMLAttributes } from 'react';
import styles from './iconLinkButton.module.scss';

interface IconLinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { 
    label: string;
    color: AppColorsType;
    active?: boolean;
    Icon: ReactSvg;
}

const IconLinkButton = ({label, color, active, Icon, className, ...rest}: IconLinkButtonProps) => {
    return(
        <button 
            className={classNames(
                styles['icon-link-button'],
                active && styles['icon-link-button--active'],
                className,
            )}
            {...rest}
        >
            <div className={classNames(
                styles['icon-link-button__icon'],
                styles[`icon-link-button__icon--${color}`],
            )}
            >
                <Icon />
            </div>
            <p className={classNames(styles['icon-link-button__label'], 'caption')}>
                {label}
            </p>
        </button>
    );
};

export default IconLinkButton;
