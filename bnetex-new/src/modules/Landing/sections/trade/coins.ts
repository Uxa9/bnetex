import { TradeCoinCardProps } from 'modules/Landing/components/tradeCoinCard/tradeCoinCard';

export const tradeSectionCoins: Omit<TradeCoinCardProps, 'market'>[] = [
    {
        logo: 'logo_BTC.png',
        ticker: 'BTCUSDT',
    },
    {
        logo: 'logo_ETH.png',
        ticker: 'ETHUSDT',
    },
    {
        logo: 'logo_BNB.png',
        ticker: 'BNBUSDT',
    },
    {
        logo: 'logo_SOL.png',
        ticker: 'SOLUSDT',
    },
];
