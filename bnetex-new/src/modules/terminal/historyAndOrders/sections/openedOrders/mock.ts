import { OpenedOrder } from './openedOrders';

export const mockedOpenedOrders: OpenedOrder[] = [
    {
        coinSymbol: {
            firstCoin: 'BTC',
            secondCoin: 'USDT',
            lever: 10,
            type: 'Бессрочные',
        },
        date: new Date(),
        type: 'Лимит',
        action: 'purchase',
        amount: 432.65,
        price: 20543.23,
    },
    {
        coinSymbol: {
            firstCoin: 'BTC',
            secondCoin: 'USDT',
            lever: 15,
            type: 'Бессрочные',
        },
        date: new Date(),
        type: 'Лимит',
        action: 'sale',
        amount: 22.65,
        price: 20743.76,
    },
];
