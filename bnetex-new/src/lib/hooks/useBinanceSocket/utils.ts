import { BinanceSymbol, LotFilter, PriceFilter } from 'modules/TradingView/api/types';
import { BinanceSocketType, ParsedDepthData, ParsedTickerData, RawSocketMessage,
    socketKeysRecord, UnparsedDepthData, UnparsedTickerData} from './types';

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

/**
 * Парсим строковое сообщение в RawSocketMessage,
 * вырезая из поля "stream" имя торговой пары (ex: btcusdt@depth => @depth)
 * @param message
 * @returns
 */
export const parseSocketMessage = (message: string): RawSocketMessage => {
    return JSON.parse(message.replace(tradePairRegex, '')) ;
};

export const tickerSocketMessageParser = (data: UnparsedTickerData) => {
    return {
        currentPrice: data.c,
    } as ParsedTickerData;
};

export const depthSocketMessageParser = (data: UnparsedDepthData) => {
    return {
        asks: data.a,
        bids: data.b,
        firstUpdate: data.U,
        finalUpdate: data.u,
        prevUpdate: data.pu,
    } as ParsedDepthData;
};

// toDo: наверное нужно сделать универсальной функцией в global utils
function parseObjectValuesToNumber<O extends Object, ReturnType>(object: O): ReturnType {
    return Object.entries(object)
        .reduce((acc: any, [ key, value ]) => {
            return { ...acc, [key]: parseFloat(value) };
        }, {}) as ReturnType;
}

export const parseBinanceSymbol = (symbol: BinanceSymbol<string>): BinanceSymbol<number> => {
    const { priceFilter, lotFilter, ...rest } = symbol;

    const parsedPriceFilter = parseObjectValuesToNumber<PriceFilter<string>, PriceFilter<number>>(priceFilter);
    const parsedLotFilter = parseObjectValuesToNumber<LotFilter<string>, LotFilter<number>>(lotFilter);

    return {
        ...rest,
        priceFilter: parsedPriceFilter,
        lotFilter: parsedLotFilter,
    };
};
