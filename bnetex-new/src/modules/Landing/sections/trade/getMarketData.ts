import axios from 'axios';
import sub from 'date-fns/sub';
import { reduceNumber } from 'lib/utils/reduceNumber';
import { SingleValueData, Time } from 'lightweight-charts';
import { CoinMarketData } from 'modules/Landing/components/tradeCoinCard/tradeCoinCard';
import { getKlines } from 'modules/TradingView/api/services';
import { TradeSectionCoin } from './coins';

/**
 * Получить данные для карточек криптовалютных пар
 * @param tickerArray [BTCUSDT, SOLUSDT] и т.д.
 * @returns
 */
const getTickerPriceStatistics = (tickerArray: TradeSectionCoin[]): Promise<CoinMarketData[]> => {
    return Promise.all(
        tickerArray.map(it => fetchTickerPriceStatistics(it.ticker, it.id))
    );
};

/**
 * Получить статистику тикера за 24 часа
 * @param ticker BTCUSDT, SOLUSDT и т.д.
 * @returns
 */
const fetchTickerPriceStatistics = (ticker: string, id: string): Promise<CoinMarketData> => {
    return axios.get(`https://api.coincap.io/v2/assets/${id}`)
        .then(async (res): Promise<CoinMarketData> => {
            const { marketCapUsd, priceUsd, changePercent24Hr } = res.data.data;

            const reducedVolume = reduceNumber(parseFloat(marketCapUsd), 2);

            return {
                price: parseFloat(priceUsd),
                volume: reducedVolume,
                change24h: parseFloat(changePercent24Hr),
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
