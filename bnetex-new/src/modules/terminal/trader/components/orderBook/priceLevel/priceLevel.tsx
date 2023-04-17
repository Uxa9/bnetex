import { ForwardedRef, forwardRef, useMemo } from 'react';
import styles from './priceLevel.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import clsx from 'clsx';
import { PriceLevelType } from '../types/types';

interface PriceLevelProps {
    price: string;
    biggestVolume: number;
    togglePrevCurrentPriceType?: () => void;
}

const PriceLevel = ({
    price, biggestVolume, togglePrevCurrentPriceType,
}: PriceLevelProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { asks, bids, price: tradePairPrice } = useTypedSelector(state => state.tradePair);

    const [priceLevelVolume, priceLevelType]: [number | undefined, PriceLevelType] = useMemo(() => {
        const volumeFromAsks = asks?.[price];
        const volumeFromBids = bids?.[price];

        const type: PriceLevelType = volumeFromAsks ? 'ask' : volumeFromBids ? 'bid' : null;

        return [volumeFromAsks ?? volumeFromBids, type];
    }, [ asks, bids, price ]);

    return (
        <div
            className={clsx(
                styles['price-level'],
                priceLevelType && styles[`price-level--${priceLevelType}`],
                // tradePairPrice === parseFloat(price) && styles['price-level--current-price']
                ref && styles['price-level--current-price']
            )}
            ref={ref}
        >
            <div
                className={styles['price-level__progress-bar']}
                style={{ width: `${Math.floor(priceLevelVolume ?? 0 / biggestVolume)}%` }}
            />
            <span>{price}</span>
            <span>{priceLevelVolume}</span>
        </div>
    );
};

export default forwardRef(PriceLevel);
