import styles from './textIcon.module.scss';
import { BaseHTMLAttributes, ForwardedRef, forwardRef } from 'react';
import clsx from 'clsx';

export interface TextIconProps extends BaseHTMLAttributes<HTMLDivElement> {
    label: string;
    Icon: ReactSvg;
    iconAlignment?: 'left' | 'right';
}

const TextIcon = forwardRef((props: TextIconProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { label, Icon, iconAlignment = 'left', className, ...rest } = props;

    return (
        <div
            className={clsx(
                styles['text-icon'],
                styles[`text-icon--icon-${iconAlignment}`],
                'text',
                className,
            )}
            {...rest}
            ref={ref}
        >
            {
                <Icon 
                    className={styles['text-icon__icon']}
                />
            }
            <p>
                {label}
            </p>
        </div>
    );
});

export default TextIcon;
