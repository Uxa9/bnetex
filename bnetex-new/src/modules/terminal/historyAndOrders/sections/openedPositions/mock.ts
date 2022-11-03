import { OpenedPosition } from './openedPositions';

export const mockedOpenePositions: OpenedPosition[] = [
    {
        coinSymbol: {
            firstCoin: 'BTC',
            secondCoin: 'USDT',
            lever: 10,
            type: 'Бессрочные',
        },
        amount: 432.65,
        entryPrice: 20543.43,
        markedPrice: 20532.76,
        liquidationPrice: 16589.54,
        margin: {
            value: 34.65,
            type: 'cross',
        },
        PNL: 24.56,
    },
    {
        coinSymbol: {
            firstCoin: 'BTC',
            secondCoin: 'USDT',
            lever: 10,
            type: 'Бессрочные',
        },
        amount: -132.65,
        entryPrice: 20543.43,
        markedPrice: 20532.76,
        liquidationPrice: 16589.54,
        margin: {
            value: 34.65,
            type: 'cross',
        },
        PNL: -14.56,
    },
];
