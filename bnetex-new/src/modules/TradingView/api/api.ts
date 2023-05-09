import { HistoryCallback, LibrarySymbolInfo, ErrorCallback, PeriodParams, ResolutionString,
    SearchSymbolsCallback, ServerTimeCallback, SubscribeBarsCallback,
    GetMarksCallback, Mark } from 'charting_library/charting_library';
import { UUID } from 'lib/types/uuid';
import getTVData from 'services/getTVData';
import { getExchangeServerTime, getSymbols, getKlines, checkInterval } from './services';
import { subscribeOnStream, unsubscribeFromStream } from './streaming';
import { TVInterval, forbiddenMarkResolutions } from './types';
import { separateKlineRequestInterval } from './utils';

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

    getBars: async function (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        periodParams: PeriodParams,
        onResult: HistoryCallback,
        onError: ErrorCallback
    ) {
        if (!checkInterval(resolution)) {
            return onError('[getBars] Invalid interval');
        }

        const klinesRequestProps = {
            symbol: symbolInfo.name,
            interval: resolution,
            from: periodParams.from * 1000,
            to: periodParams.to * 1000,
        };

        const separatedIntervals = separateKlineRequestInterval(
            {
                from: klinesRequestProps.from,
                to: klinesRequestProps.to,
            },
            resolution
        );

        const data = await Promise.all(
            separatedIntervals.map(it => getKlines({...klinesRequestProps, from: it.from, to: it.to}))
        ).then(data => {
            return data.reduce((acc, it) => acc.concat(it), []);
        });

        if (data.length > 0) return onResult(data);
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
        from: number,
        to: number,
        onDataCallback: GetMarksCallback<Mark>,
        resolution: ResolutionString
    ) => {
        const isResolutionForbidden = !!forbiddenMarkResolutions.find(it => it === resolution);
        if (isResolutionForbidden) return onDataCallback([]);

        getTVData({
            from: from * 1000,
            to: Math.min(to * 1000, Date.now()),
        }).then(data => {
            onDataCallback(data);
        });
    },
};
