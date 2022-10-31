import { Info, ToolTipNeedle } from 'assets/images/icons';
import classNames from 'classnames';
import { FC, useState } from 'react';
import styles from './toolTip.module.scss';

interface ToolTipProps {
    title: string;
    infoText: string; 
    className?: string;
}

const ToolTip = ({title, infoText, className}: ToolTipProps) => {

    const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(false);
    
    return(
        <div 
            className={classNames(
                styles.title,
                {[styles['title--active']]: isToolTipVisible},
                className,
            )}
            onMouseEnter={() => setIsToolTipVisible(true)}
            onMouseLeave={() => setIsToolTipVisible(false)}
            onClick={() => setIsToolTipVisible(true)}
            onBlur={() => setIsToolTipVisible(false)}
        >
            <span className={'caption'}>{title}</span>
            <div className={styles.iconWrapper}>
                <div className={classNames(
                    styles.tip,
                    'caption'
                )}
                >
                    {infoText}
                </div>
                <ToolTipNeedle 
                    className={styles.needle}
                />
                <Info 
                    className={styles.infoIcon}
                />
            </div>
        </div>
    );
};

export default ToolTip;
