import { getSymbols } from '../api/services';
import { BinanceSymbol } from '../api/types';
import { DEFAULT_TRADE_PAIR } from '../defaultProps';

/**
 * Проверяет существование торговой пары на binance.
 * Если пара существует, возвращает ее.
 * В противном случае возвращает результат запроса для дефолтной пары (BTCUSDT)
 * @param tradePair
 * @returns
 */
export const validateTradePair = async (tradePair: string | null): Promise<BinanceSymbol> => {
    if (!tradePair) return validateTradePair(DEFAULT_TRADE_PAIR);

    return getSymbols(tradePair)
        .then(res => {
            const respondedTradePair = res.data.at(0);
            const isPairValid = tradePair === respondedTradePair?.symbol;
            return isPairValid && respondedTradePair ? respondedTradePair : validateTradePair(DEFAULT_TRADE_PAIR);
        });
};
