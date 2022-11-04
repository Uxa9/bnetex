import { OrderHistoryItem } from './orderHistory';

export const mockedOrderHistory: OrderHistoryItem[] = [
    {
        coinSymbol: {
            firstCoin: 'BTC',
            secondCoin: 'USDT',
            lever: 10,
            type: 'Бессрочные',
        },
        date: new Date(),
        // type: 'Рынок',
        action: 'purchase',
        amount: 432.65,
        price: 20543.23,
        // fee: 0.0021432,
        PNL: 43,
    },
    {
        coinSymbol: {
            firstCoin: 'BTC',
            secondCoin: 'USDT',
            lever: 20,
            type: 'Бессрочные',
        },
        date: new Date(),
        // type: 'Лимит',
        action: 'sale',
        amount: 432.65,
        price: 21643.23,
        // fee: 0.0021432,
        PNL: 12.54,
    },
];
