import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './orderBook.module.scss';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { useBinanceSocket } from 'lib/hooks/useBinanceSocket/useBinanceSocket';
import PriceLevel from './priceLevel/priceLevel';
import { ORDER_BOOK_STEP } from './types/types';
import useOrderBook from './hooks/useOrderBook';
import { log } from 'console';

const OrderBook = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const currentPriceLevelRef = useRef<HTMLDivElement>(null);
    const [ priceLevels, setPriceLevels ] = useState<number[] | null>(null);

    const { tradePairAssets, tradePair } = useBinanceSocket();
    const { price, asks, bids, orderBookLoading } = useTypedSelector(state => state.tradePair);

    const { generateMorePriceLevels } = useOrderBook({ setPriceLevels });

    const biggestVolume: number = useMemo(() => {
        if (!asks || !bids) return 1;

        const biggestAsk = Object.values(asks).reduce((acc, it) => it > acc ? it : acc, 0);
        const biggestBid = Object.values(bids).reduce((acc, it) => it > acc ? it : acc, 0);

        return Math.max(biggestAsk, biggestBid);
    }, [ asks, bids ]);

    useEffect(() => {
        if (priceLevels || !price) return;

        generateMorePriceLevels(price);
    }, [ price, tradePair]);

    const evaluateCurrentPriceRef = useCallback((itemPrice: number) => {

        if (!price) return null;
        console.log( Math.abs(itemPrice - price));

        return Math.abs(itemPrice - price) <= ORDER_BOOK_STEP ? currentPriceLevelRef : null;
    }, [ price ]);

    return (
        <div
            className={styles['container']}
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
            <div className={styles['prices']}>
                {
                    priceLevels?.map(it =>
                        <PriceLevel
                            price={it.toFixed(1)}
                            biggestVolume={biggestVolume}
                            key={it}
                            ref={evaluateCurrentPriceRef(it)}
                        />)
                }
            </div>
        </div>
    );
};

export default OrderBook;
