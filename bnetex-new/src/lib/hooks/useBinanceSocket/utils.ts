import { AvailableSocketKeys, BinanceSocketType, ParsedDepthData, ParsedTickerData, socketKeysRecord, UnparsedSocketMessage } from './types';

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

const tradePairRegex = new RegExp(/(?<=("stream":"))[a-z]*/);

export const parseSocketMessage = (message: string) => {
    // Парсим строковое сообщение в Object: UnparsedSocketMessage,
    // вырезая из поля "stream" имя торговой пары (ex: btcusdt@depth => @depth)
    const { data, stream } = JSON.parse(message.replace(tradePairRegex, '')) as UnparsedSocketMessage;

    // eslint-disable-next-line default-case
    switch (stream) {
        case AvailableSocketKeys.TICKER: {
            return {
                streamKey: stream,
                currentPrice: data.c,
            } as ParsedTickerData;
        }
        case AvailableSocketKeys.DEPTH: {
            return {
                streamKey: stream,
                asks: data.a,
                bids: data.b,
                firstUpdate: data.U,
                finalUpdate: data.u,
                prevUpdate: data.pu,
            } as ParsedDepthData;
        }
    }
};
