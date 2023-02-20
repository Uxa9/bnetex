import { TradeCoinCardProps } from 'modules/Landing/components/tradeCoinCard/tradeCoinCard';

export type TradeSectionCoin = Omit<TradeCoinCardProps, 'market'> & { id: string };

export const tradeSectionCoins: TradeSectionCoin[] = [
    {
        logo: 'logo_BTC.png',
        ticker: 'BTCUSDT',
        id: 'bitcoin',
    },
    {
        logo: 'logo_ETH.png',
        ticker: 'ETHUSDT',
        id: 'ethereum',
    },
    {
        logo: 'logo_BNB.png',
        ticker: 'BNBUSDT',
        id: 'binance-coin',
    },
    {
        logo: 'logo_SOL.png',
        ticker: 'SOLUSDT',
        id: 'solana',
    },
];
