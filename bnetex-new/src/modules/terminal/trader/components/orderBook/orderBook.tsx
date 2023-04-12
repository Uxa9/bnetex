import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './orderBook.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { useBinanceSocket } from 'lib/hooks/useBinanceSocket/useBinanceSocket';

const ORDER_BOOK_STEP = 0.1;
const DEFAULT_ORDER_BOOK_SIZE = 40;

const OrderBook = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ priceLevels, setPriceLevels ] = useState<[number, number] | null>(null);

    const { tradePairAssets } = useBinanceSocket();
    const { price, asks, bids, orderBookLoading } = useTypedSelector(state => state.tradePair);

    const biggestVolume: number | null = useMemo(() => {
        if (!asks || !bids) return null;

        const biggestAsk = Object.values(asks).reduce((acc, it) => it > acc ? it : acc, 0);
        const biggestBid = Object.values(bids).reduce((acc, it) => it > acc ? it : acc, 0);

        return Math.max(biggestAsk, biggestBid);
    }, [ asks, bids ]);

    useEffect(() => {

    }, []);

    return (
        <div
            className={'container'}
            ref={containerRef}
        >
            <header className={styles['header']}>
                <p className={'text'}>
                    {`Цена (${tradePairAssets?.quoteAsset})`}
                </p>
                <p className={'text'}>
                    {`Объем (${tradePairAssets?.baseAsset})`}
                </p>
            </header>
        </div>
    );
};

export default OrderBook;
