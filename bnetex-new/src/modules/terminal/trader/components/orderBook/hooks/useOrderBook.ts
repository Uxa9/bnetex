import { Dispatch, SetStateAction, useCallback } from 'react';
import { DEFAULT_ORDER_BOOK_INCREMENT, MAX_ORDER_BOOK_SIZE, ORDER_BOOK_STEP } from '../types/types';

interface UseOrderBookProps {
    setPriceLevels: Dispatch<SetStateAction<number[] | null>>
}

const useOrderBook = ({setPriceLevels}: UseOrderBookProps) => {

    const generateLowerPriceLevels = (basePriceLevel: number) => {
        const extraPriceLevels: number[] = [ basePriceLevel ];

        for (let i = 0; i < DEFAULT_ORDER_BOOK_INCREMENT; i++) {
            if (extraPriceLevels[i] === 0) break;
            const incrementedValue = extraPriceLevels[i] - ORDER_BOOK_STEP;
            extraPriceLevels.push(incrementedValue);
        }

        return extraPriceLevels;
    };

    const generateHigherPriceLevels = (basePriceLevel: number) => {
        const extraPriceLevels: number[] = [ basePriceLevel ];

        for (let i = 0; i < DEFAULT_ORDER_BOOK_INCREMENT; i++) {
            const incrementedValue = extraPriceLevels[i] + ORDER_BOOK_STEP;
            extraPriceLevels.push(incrementedValue);
        }

        return extraPriceLevels.reverse();
    };

    const generateMorePriceLevels = useCallback((basePriceLevel: number, action?: 'increment' | 'decrement') => {
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
                const extraLowerPriceLevels = generateLowerPriceLevels(basePriceLevel);
                const extraHigherPriceLevels = generateHigherPriceLevels(extraLowerPriceLevels[0] + ORDER_BOOK_STEP);
                setPriceLevels(extraHigherPriceLevels.concat(extraLowerPriceLevels));
            }
        }
    }, [ setPriceLevels ]);

    return { generateMorePriceLevels };
};

export default useOrderBook;
