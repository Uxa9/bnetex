import { BinanceSocketType, socketKeysRecord } from './types';

/**
 * Создает строку для combined stream
 *
 * example: 'tradePair@markPrice/tradePair@miniTicker'
 * @param tradePair - торговая пара
 * @param type - тип сокета
 */
export const createCombinedStreamString = (tradePair: string, type: BinanceSocketType) => {
    const socketKeys = socketKeysRecord[type];

    return socketKeys.map(it => `${tradePair.toLowerCase()}${it}`).join('/');
};

/**
 * Генерирует id сокета. Вынесено в отдельную функцию для
 * возможности легко поменять логику генерации id
 * (что вряд ли понадобится, но тем не менее)
 * @param tradePair
 * @param type
 */
export const generateSocketId = (tradePair: string, type: BinanceSocketType) => {
    return `${tradePair}--${type}`;
};
