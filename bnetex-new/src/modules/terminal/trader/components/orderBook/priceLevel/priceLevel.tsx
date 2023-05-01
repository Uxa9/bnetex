import { ForwardedRef, forwardRef, useMemo } from 'react';
import styles from './priceLevel.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import clsx from 'clsx';
import { PriceLevelType } from '../types/types';

interface PriceLevelProps {
    price: string;
    biggestVolume: number;
}

const PriceLevel = ({
    price, biggestVolume,
}: PriceLevelProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { asks, bids, price: tradePairPrice } = useTypedSelector(state => state.tradePair);

    const [priceLevelVolume, priceLevelType]: [number | undefined, PriceLevelType] = useMemo(() => {
        // парсим во float, чтобы корректно обрабатывать значения с нулем на конце:
        // 1000.10 -> 1000,1 (т.к. в asks/bids ключи являются числом)
        const floatPrice = parseFloat(price);
        const volumeFromAsks = asks?.[floatPrice];
        const volumeFromBids = bids?.[floatPrice];

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
