import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { DEFAULT_ORDER_BOOK_INCREMENT, MAX_ORDER_BOOK_SIZE } from '../types/types';
import { useBinanceSocket } from 'lib/hooks/useBinanceSocket/useBinanceSocket';

interface UseOrderBookProps {
    setPriceLevels: Dispatch<SetStateAction<number[] | null>>;
    tickSize?: number;
}

/**
 * Хук, инкапсулирующий методы обновления цен в стакане
 * @returns
 */
const useOrderBook = ({ setPriceLevels }: UseOrderBookProps) => {

    const { tradePair, tradePairFractionDigits } = useBinanceSocket();

    const tickSize: number | null = useMemo(() => {
        return tradePair?.priceFilter.tickSize ?? null;
    }, [ tradePair ]);

    /**
     * Сгенерировать массив цен, меньших цены basePriceLevel
     * @param basePriceLevel
     */
    const generateLowerPriceLevels = (basePriceLevel: number, quantity = DEFAULT_ORDER_BOOK_INCREMENT) => {
        const extraPriceLevels: number[] = [ basePriceLevel ];

        for (let i = 0; i < quantity; i++) {
            if (extraPriceLevels[i] === 0) break;
            const incrementedValue = (extraPriceLevels[i] - tickSize!).toFixed(tradePairFractionDigits);
            extraPriceLevels.push(parseFloat(incrementedValue));
        }

        return extraPriceLevels;
    };

    /**
     * Сгенерировать массив цен, бОльших цены basePriceLevel
     * @param basePriceLevel
     */
    const generateHigherPriceLevels = (basePriceLevel: number, quantity = DEFAULT_ORDER_BOOK_INCREMENT) => {
        const extraPriceLevels: number[] = [ basePriceLevel ];

        for (let i = 0; i < quantity; i++) {
            const incrementedValue = (extraPriceLevels[i] + tickSize!).toFixed(tradePairFractionDigits);
            extraPriceLevels.push(parseFloat(incrementedValue));
        }

        return extraPriceLevels.reverse();
    };

    /**
     * Функция виртуализации списка цен в стакане. Позволяет добавлять цены
     * меньшие/большие basePriceLevel.
     * Автоматически удаляет из стейта некоторое число цен (по умолчанию 20 элементов)
     * при превышении лимита на размер стейта.
     */
    const generateMorePriceLevels = useCallback((basePriceLevel: number, action?: 'increment' | 'decrement') => {
        if (!tickSize) return;

        switch (action) {
            case 'increment': {
                const extraPriceLevels = generateHigherPriceLevels(basePriceLevel);
                setPriceLevels(prevState => {
                    if (!prevState) return extraPriceLevels;
                    if (prevState.length === MAX_ORDER_BOOK_SIZE) prevState.splice(-1, DEFAULT_ORDER_BOOK_INCREMENT);
                    return extraPriceLevels.concat(...prevState);
                });
                break;
            }
            case 'decrement': {
                const extraPriceLevels = generateLowerPriceLevels(basePriceLevel);
                setPriceLevels(prevState => {
                    if (!prevState) return extraPriceLevels;
                    if (prevState.length === MAX_ORDER_BOOK_SIZE) prevState.splice(0, DEFAULT_ORDER_BOOK_INCREMENT);
                    return prevState.concat(...extraPriceLevels);
                });
                break;
            }
            default: {
                const extraLowerPriceLevels = generateLowerPriceLevels(basePriceLevel, 19);
                const extraHigherPriceLevels = generateHigherPriceLevels(extraLowerPriceLevels[0] + tickSize, 19);
                setPriceLevels(extraHigherPriceLevels.concat(extraLowerPriceLevels));
            }
        }
    }, [ setPriceLevels, tickSize ]);

    return { generateMorePriceLevels };
};

export default useOrderBook;
