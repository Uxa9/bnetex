import axios from 'axios';
import { CoinMarketData } from 'modules/Landing/components/tradeCoinCard/tradeCoinCard';

const getTickerPriceStatistics = (ticker: string[]): Promise<CoinMarketData[]> => {
    return Promise.all(
        ticker.map(it => fetchTickerPriceStatistics(it))
    );
};

const fetchTickerPriceStatistics = (ticker: string): Promise<CoinMarketData> => {
    return axios.get(`https://api.binance.com/api/v1/ticker/24hr?symbol=${ticker}`)
        .then((res): CoinMarketData => {
            const { quoteVolume, lastPrice, priceChangePercent } = res.data;
            return {
                price: parseFloat(lastPrice),
                volume: parseFloat(quoteVolume),
                change24h: parseFloat(priceChangePercent),
            };
        });
};

export default getTickerPriceStatistics;
