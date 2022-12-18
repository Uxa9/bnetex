import { HistoryCallback, LibrarySymbolInfo, ErrorCallback, PeriodParams, ResolutionString,
    SearchSymbolsCallback, ServerTimeCallback, SubscribeBarsCallback,
    GetMarksCallback, Mark } from 'charting_library/charting_library';
import { UUID } from 'lib/types/uuid';
import { getExchangeServerTime, getSymbols, getKlines, checkInterval } from './services';
import { subscribeOnStream, unsubscribeFromStream } from './streaming';
import { TVInterval } from './types';

const configurationData = {
    supports_marks: true,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: [
        '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D',
    ],
};

export default {
    // get a configuration of your datafeed (e.g. supported resolutions, exchanges and so on)
    onReady: (callback: any) => {
        setTimeout(() => callback(configurationData)); // callback must be called asynchronously.
    },

    // retrieve information about a specific symbol (exchange, price scale, full symbol etc.)
    // ResolveCallback
    resolveSymbol: (symbolName: string, onResolve: any, onError: (reason: string) => void) => {

        const comps = symbolName.split(':');
        symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase();

        // need for pricescale()
        function pricescale(symbol: any) {
            for (let filter of symbol.filters) {
                if (filter.filterType === 'PRICE_FILTER') {
                    return Math.round(1 / parseFloat(filter.tickSize));
                }
            }
            return 1;
        }

        const symbolInfo = (symbol: any) => ({
            name: symbol.symbol,
            format: 'volume',
            full_name: symbol.full,
            description: symbol.baseAsset + ' / ' + symbol.quoteAsset,
            ticker: symbol.symbol,
            exchange: 'Binance',
            listed_exchange: 'Binance',
            type: 'crypto',
            session: '24x7',
            minmov: 1,
            pricescale: pricescale(symbol), // 	or 100
            timezone: 'UTC',
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            currency_code: symbol.quoteAsset,
        });

        // Get symbols
        getSymbols().then(symbols => {
            const symbol = symbols.find((i: any) => i.symbol === symbolName);
            return symbol ? onResolve(symbolInfo(symbol)) : onError('[resolveSymbol]: symbol not found');
        });
    },

    getBars: async (symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback) => {
        if (!checkInterval(resolution)) {
            return onError('[getBars] Invalid interval');
        }

        const klines = await getKlines({
            symbol: symbolInfo.name,
            interval: resolution,
            from: periodParams.from,
            to: periodParams.to,
        });

        if (klines.length > 0) return onResult(klines);

        onError('[getBars] Klines Data error');
    },

    // подписать на сокет со свечками
    subscribeBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: TVInterval,
        onTick: SubscribeBarsCallback,
        listenerGuid: UUID
    ) => {
        subscribeOnStream(symbolInfo, resolution, listenerGuid, onTick);
    },

    // закрыть сокет по его id
    unsubscribeBars: (subscriberUID: UUID) => {
        unsubscribeFromStream(subscriberUID);
    },

    getServerTime: (callback: ServerTimeCallback) => {
        getExchangeServerTime()
            .then((time: number) => {
                // не знаю почему, но у tv какие то блядские приколы со временем
                callback(Math.floor(time / 1000));
            });
    },

    searchSymbols: (
        _userInput: string,
        _exchange: string,
        _symbolType: string,
        _onResult: SearchSymbolsCallback
    ) => {

    },

    getMarks: (
        _symbolInfo: LibrarySymbolInfo,
        _from: number,
        _to: number,
        onDataCallback: GetMarksCallback<Mark>,
        _resolution: ResolutionString
    ) => {
        const arr: Mark[] = [{
            time: Number(new Date()) / 1000,
            id: 1,
            color: 'red',
            text:'Продажа какого то актива',
            label: 'S',
            minSize: 14,
            labelFontColor: '#ffffff',
        },
        {
            time: Number(new Date()) / 1000,
            id: 2,
            color: 'green',
            text:'Покупка какого то актива',
            label: 'B',
            minSize: 14,
            labelFontColor: '#ffffff',
        },
        ];

        onDataCallback(arr);
        // console.log('[getMarks]: Method call');
        // console.log(symbolInfo);
        // console.log(resolution);
        // console.log(onDataCallback);
    },
};
