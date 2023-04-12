import { useMemo, useRef, useState } from 'react';
import styles from './orderBook.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';

const OrderBook = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [ priceLevels, setPriceLevels ] = useState<[number, number] | null>(null);
    const { price, asks, bids, orderBookLoading } = useTypedSelector(state => state.tradePair);

    const biggestVolume: number | null = useMemo(() => {
        if (!asks || !bids) return null;

        const biggestAsk = Object.values(asks).reduce((acc, it) => it > acc ? it : acc, 0);
        const biggestBid = Object.values(bids).reduce((acc, it) => it > acc ? it : acc, 0);

        return Math.max(biggestAsk, biggestBid);
    }, [ asks, bids ]);

    return (
        <div
            className={'container'}
            ref={containerRef}
        >

        </div>
    );
};

export default OrderBook;
