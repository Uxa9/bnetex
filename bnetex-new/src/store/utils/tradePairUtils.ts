import { OrderBookDictionary } from 'store/actions/tradePair';

/**
 * По какой-то неведомой мне причине данные приходят в формате [string, string]
 * поэтому приходится тратить доп. ресурсы на конвертирование в [number, number]
 * здесь же создаем Map, в котором ключом является цена, а значением - объем
 * @param array
 * @returns
 */
export const parseAsksOrBidsArray = (array: [string, string][]): OrderBookDictionary => {
    const dictionary: OrderBookDictionary = {};
    array.forEach(it => {
        const price = parseFloat(it[0]);
        const volume = parseFloat(it[1]);
        dictionary[price] = volume;
    });
    return dictionary;
};

/**
 * Согласно документации каждое новое обновление перекрывает значение предыдущего.
 * А если в новом обновлении для цены пришел объем равный нулю, эту цену нужно удалить
 * из стакана
 * @param prevState
 * @param update
 * @returns prevState updated with update map's values
 */
export const mergeOrderBookUpdate = (prevState: OrderBookDictionary, update: OrderBookDictionary) => {
    const prevStateCopy = { ...prevState };
    for (let [key, value] of Object.entries(update)) {
        value === 0
            ? delete prevStateCopy[key]
            : prevStateCopy[key] = value;
    }
    return prevStateCopy;
};
