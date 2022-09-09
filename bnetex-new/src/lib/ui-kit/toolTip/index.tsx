import { Info, ToolTipNeedle } from 'assets/images/icons';
import classNames from 'classnames';
import { FC, useState } from 'react';
import styles from './toolTip.module.scss';

interface ToolTipProps{
    title: string,
    infoText: string
}

const ToolTip:FC<ToolTipProps> = ({title, infoText}) => {

    const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(false);
    
    return(
        <div 
            className={classNames(
                styles.title,
                {[styles['title--active']]: isToolTipVisible}
            )}
            onMouseEnter={() => setIsToolTipVisible(true)}
            onMouseLeave={() => setIsToolTipVisible(false)}
            onClick={() => setIsToolTipVisible(true)}
            onBlur={() => setIsToolTipVisible(false)}
        >
            <span>{title}</span>
            <div className={styles.iconWrapper}>
                <div className={styles.tip}>
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
