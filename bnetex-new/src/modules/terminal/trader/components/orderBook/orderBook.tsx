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

    // Первичная генерация массива цен в стакане.
    // должна выполняться при наличии цены торговой пары
    // и пустом массиве цен (т.е. либо после монтирования либо после смены торговой пары)
    useEffect(() => {
        if (priceLevels || !price) return;

        generateMorePriceLevels(price);
    }, [ price ]);

    // Очистка массива цен при смене торговой пары
    useEffect(() => {
        if (priceLevels) setPriceLevels(null);
    }, [ tradePair ]);

    // цена по текущему шагу ближайшая к текущей цене
    // например, при шаге в 10 и цене в 21117 ближайшей ценой будет 21120
    const closestToCurrentPrice = useMemo(() => {
        if (!price) return null;
        const roundedToNearest = Math.round(price / ORDER_BOOK_STEP) * ORDER_BOOK_STEP;

        return Math.round(roundedToNearest * 10) / 10;
    }, [ price ]);

    // реф должен передаваться только в тот компонент цены, в котором отображается
    // актуальная цена торговой пары (или ближайшая к ней)
    const evaluateCurrentPriceRef = useCallback((itemPrice: number) => {
        console.log( itemPrice);

        return closestToCurrentPrice === itemPrice ? currentPriceLevelRef : null;
    }, [ closestToCurrentPrice ]);

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
