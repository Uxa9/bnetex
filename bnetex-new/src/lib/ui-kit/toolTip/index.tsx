import { Info, ToolTipNeedle } from 'assets/images/icons';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import styles from './toolTip.module.scss';
import { Properties as CSSProperties } from 'csstype';

interface ToolTipProps {
    title: string;
    infoText: string; 
    className?: string;
}

interface TipPosition extends Pick<CSSProperties, 'right'> {}

const TIP_SIDE_OFFSET = 16;
const DEFAULT_TIP_POSITION = `-${TIP_SIDE_OFFSET}px`;

const ToolTip = ({title, infoText, className }: ToolTipProps) => {

    const [isToolTipVisible, setIsToolTipVisible] = useState<boolean>(false);
    const [tipPosition, setTipPosition] = 
        useState<TipPosition['right']>(DEFAULT_TIP_POSITION);
    const iconContainerRef = useRef<HTMLDivElement | null>(null);
    const tipRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        if (!tipRef.current || !iconContainerRef.current) return;

        const { left: iconContainerLeft } = iconContainerRef.current.getBoundingClientRect();
        const { width} = tipRef.current.getBoundingClientRect();
        
        const tipWillOverflow = width + TIP_SIDE_OFFSET > iconContainerLeft;

        setTipPosition(tipWillOverflow ? 
            `${iconContainerLeft - width - TIP_SIDE_OFFSET}px` : 
            DEFAULT_TIP_POSITION
        );
    };

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
            <div 
                className={styles.iconWrapper}
                ref={iconContainerRef}
            >
                <ToolTipNeedle 
                    className={styles.needle}
                />
                <Info 
                    className={styles.infoIcon}
                />
                <div 
                    className={classNames(
                        styles.tip,
                        'caption'
                    )}
                    style={{
                        right: tipPosition,
                    }}
                    ref={tipRef}
                >
                    {infoText}
                </div>
            </div>
        </div>
    );
};

export default ToolTip;
