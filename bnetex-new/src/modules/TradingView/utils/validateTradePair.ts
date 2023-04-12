import { getSymbols } from '../api/services';
import { BinanceSymbol } from '../api/types';
import { DEFAULT_TRADE_PAIR } from '../defaultProps';

/**
 * Проверяет существование торговой пары на binance.
 * Если пара существует, возвращает ее.
 * В противном случае возвращает дефолтную пару (BTCUSDT)
 * @param tradePair
 * @returns
 */
export const validateTradePair = async (tradePair: string | null): Promise<Omit<BinanceSymbol, 'priceFilter'>> => {
    if (!tradePair) return DEFAULT_TRADE_PAIR;

    return getSymbols(tradePair)
        .then(res => {
            const respondedTradePair = res.data.at(0);
            const isPairValid = tradePair === respondedTradePair?.symbol;
            return isPairValid && respondedTradePair ? respondedTradePair : DEFAULT_TRADE_PAIR;
        });
};
