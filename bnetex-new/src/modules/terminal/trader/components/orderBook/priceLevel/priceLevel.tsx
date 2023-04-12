import { ForwardedRef, forwardRef } from 'react';
import styles from './priceLevel.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import clsx from 'clsx';

interface PriceLevelProps {
    priceValue: string;
    volume: number;
    biggestVolume: number;
    isCurrentPrice?: boolean;
}

const PriceLevel = ({ priceValue, volume, biggestVolume, isCurrentPrice }: PriceLevelProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { asks, bids } = useTypedSelector(state => state.tradePair);

    return (
        <div
            className={clsx(
                styles['price-level'],
                asks?.[priceValue] && styles['price-level--ask'],
                bids?.[priceValue] && styles['price-level--bid'],
                isCurrentPrice && styles['price-level--current-price']
            )}
            ref={ref}
        >
            <div
                className={styles['price-level__progress-bar']}
                style={{ width: `${Math.floor(parseFloat(priceValue) / biggestVolume)}%` }}
            />
            <span>{priceValue}</span>
            <span>{volume}</span>
        </div>
    );
};

export default forwardRef(PriceLevel);
