import { getSymbols } from '../api/services';
import { DEFAULT_TRADE_PAIR } from '../defaultProps';

/**
 * Проверяет существование торговой пары на binance.
 * Если пара существует, возвращает ее.
 * В противном случае возвращает дефолтную пару (BTCUSDT)
 * @param tradePair
 * @returns
 */
export const validateTradePair = async (tradePair: string | null) => {
    if (!tradePair) return DEFAULT_TRADE_PAIR;

    const validatedTradePair = await getSymbols(
        tradePair
    )
        .then(res => {
            const isPairValid = tradePair === res.data.at(0)?.symbol;
            return isPairValid ? tradePair : DEFAULT_TRADE_PAIR;
        });

    return validatedTradePair;
};
