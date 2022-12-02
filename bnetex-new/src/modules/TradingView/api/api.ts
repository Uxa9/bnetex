import { DatafeedConfiguration, HistoryCallback, LibrarySymbolInfo, ErrorCallback, OnReadyCallback, PeriodParams, ResolutionString, ResolveCallback, SearchSymbolsCallback, ServerTimeCallback, SubscribeBarsCallback, SymbolResolveExtension, GetMarksCallback, Mark } from 'charting_library/charting_library';
import { UUID } from 'lib/types/uuid';
import { getExchangeServerTime, getSymbols, getKlines, subscribeKline, unsubscribeKline, checkInterval } from './services';
import { TVInterval } from './types';

const configurationData = {
    supports_marks: true,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: [
        '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D', '1W', '1M',
    ],
};

export default {
    // get a configuration of your datafeed (e.g. supported resolutions, exchanges and so on)
    onReady: (callback: any) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData)); // callback must be called asynchronously.
    },
    /*
	 // NO need if not using search
	searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
		console.log('[searchSymbols]: Method call');
	},
	 */
    // retrieve information about a specific symbol (exchange, price scale, full symbol etc.)
    // ResolveCallback
    resolveSymbol: (symbolName: string, onResolve: any, onError: (reason: string) => void, extension?: SymbolResolveExtension) => {
        console.log('[resolveSymbol]: Method call', symbolName);

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
    // get historical data for the symbol
    // https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
    getBars: async (symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, periodParams: PeriodParams, onResult: HistoryCallback, onError: ErrorCallback) => {
        console.log('[getBars] Method call', symbolInfo, resolution);

        if (!checkInterval(resolution)) {
            return onError('[getBars] Invalid interval');
        }

        const klines = await getKlines({ symbol: symbolInfo.name, interval: resolution, from: periodParams.from, to: periodParams.to })
            .catch(err => console.log(err)
            );
        console.log(klines);
        if (klines.length > 0) {
            return onResult(klines);
        }

        onError('[getBars] Klines Data error');

    },
    // subscription to real-time updates
    subscribeBars: (symbolInfo: LibrarySymbolInfo, resolution: TVInterval, onTick: SubscribeBarsCallback, listenerGuid: UUID, onResetCacheNeededCallback: () => void) => {
        console.log('[subscribeBars]: Method call with subscribeUID:', listenerGuid);

        subscribeKline({ symbol: symbolInfo.name,
            interval: resolution,
            uniqueID: listenerGuid,
            from: undefined,
            to: undefined, 
        }, (cb: any) => onTick(cb));
    },
    unsubscribeBars: (subscriberUID: UUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        unsubscribeKline(subscriberUID);
    },

    getServerTime: (callback: ServerTimeCallback) => {
        getExchangeServerTime().then(time => {
            callback(Math.floor(time / 1000));
        }).catch(err => {
            console.error(err);
        });
    },

    searchSymbols: (userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback) => {
        
    },

    getMarks: (symbolInfo: LibrarySymbolInfo, from: number, to: number, onDataCallback: GetMarksCallback<Mark>, resolution: ResolutionString) => {
        console.log('[getMarks]: Method call');
        console.log( symbolInfo);
        console.log(from);
        console.log(to);
        console.log(resolution);
        console.log(onDataCallback);
    },
};
