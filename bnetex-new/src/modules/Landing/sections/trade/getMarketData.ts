import axios from 'axios';
import sub from 'date-fns/sub';
import { SingleValueData, Time } from 'lightweight-charts';
import { CoinMarketData } from 'modules/Landing/components/tradeCoinCard/tradeCoinCard';
import { getKlines } from 'modules/TradingView/api/services';

/**
 * Получить данные для карточек криптовалютных пар
 * @param tickerArray [BTCUSDT, SOLUSDT] и т.д.
 * @returns
 */
const getTickerPriceStatistics = (tickerArray: string[]): Promise<CoinMarketData[]> => {
    return Promise.all(
        tickerArray.map(it => fetchTickerPriceStatistics(it))
    );
};

/**
 * Получить статистику тикера за 24 часа
 * @param ticker BTCUSDT, SOLUSDT и т.д.
 * @returns
 */
const fetchTickerPriceStatistics = (ticker: string): Promise<CoinMarketData> => {
    return axios.get(`https://api.binance.com/api/v1/ticker/24hr?symbol=${ticker}`)
        .then(async (res): Promise<CoinMarketData> => {
            const { quoteVolume, lastPrice, priceChangePercent } = res.data;
            return {
                price: parseFloat(lastPrice),
                volume: parseFloat(quoteVolume),
                change24h: parseFloat(priceChangePercent),
                graphicData: await fetchTickerKlines(ticker),
            };
        });
};

/**
 * получить свечки за два дня и преобразовать их в точки для
 * графика lightweightCharts
 * @param ticker BTCUSDT, SOLUSDT и т.д.
 * @returns
 */
const fetchTickerKlines = (ticker: string): Promise<SingleValueData[]> => {

    const from = Number(sub(new Date, {days: 2}));
    const to = Number(new Date());

    return getKlines({symbol: ticker, interval: '240', from: from, to: to})
        .then(res =>
            res.map(it => {
                return {
                    time: it.time / 1000 as Time,
                    value: it.close,
                };
            })
        );
};

export default getTickerPriceStatistics;
