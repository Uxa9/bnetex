import { HistoryCallback, LibrarySymbolInfo, ErrorCallback, PeriodParams, ResolutionString,
    SearchSymbolsCallback, ServerTimeCallback, SubscribeBarsCallback,
    GetMarksCallback, Mark, ResolveCallback } from 'charting_library/charting_library';
import { OnReadyCallback } from 'charting_library/datafeed-api';
import { UUID } from 'lib/types/uuid';
import { debounce } from 'lib/utils/vanillaDebounce';
import getTVData from 'services/getTVData';
import { getExchangeServerTime, getSymbols, getKlines, checkInterval, searchSymbols } from './services';
import { subscribeOnStream, unsubscribeFromStream } from './streaming';
import { TVInterval, forbiddenMarkResolutions, HistoryPeriod, configurationData } from './types';
import { createSymbolInfo, separateKlineRequestInterval } from './utils';

export default {
    // get a configuration of your datafeed (e.g. supported resolutions, exchanges and so on)
    onReady: (callback: OnReadyCallback) => {
        setTimeout(() => callback(configurationData)); // callback must be called asynchronously.
    },

    // retrieve information about a specific symbol (exchange, price scale, full symbol etc.)
    // ResolveCallback
    resolveSymbol: (symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback) => {

        // ну я так понимаю что может придти что-то типа BTC: BTCUSDT или кто
        const parsedSymbolName = symbolName.split(':').at(1)?.toUpperCase();

        getSymbols(parsedSymbolName ?? symbolName)
            .then(res => {
                const symbol = res.data.at(0);
                return symbol ? onResolve(createSymbolInfo(symbol)) : onError('[resolveSymbol]: symbol not found');
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

        const data = await Promise
            .all(
                separatedIntervals
                    .map(it => getKlines({...klinesRequestProps, from: it.from, to: it.to}))
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
        userInput: string,
        _exchange: string,
        _symbolType: string,
        onResult: SearchSymbolsCallback
    ) => {
        const debouncedSearch = debounce(() => {
            searchSymbols(userInput)
                .then(res => onResult(res));
        }, 500);

        debouncedSearch();
    },

    getMarks: (
        _symbolInfo: LibrarySymbolInfo,
        _from: number,
        _to: number,
        onDataCallback: GetMarksCallback<Mark>,
        resolution: ResolutionString
    ) => {
        const lsHistoryPeriod = Number(localStorage.getItem('history')) as HistoryPeriod;
        const isResolutionForbidden = !!forbiddenMarkResolutions.find(it => it === resolution);

        if (!lsHistoryPeriod || isResolutionForbidden) return onDataCallback([]);

        getTVData(lsHistoryPeriod).then(data => onDataCallback(data));
    },
};
