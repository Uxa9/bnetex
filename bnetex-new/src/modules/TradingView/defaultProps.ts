import { ChartingLibraryWidgetOptions, LanguageCode, ResolutionString } from 'charting_library/charting_library';
import api from './api/api';

type DefaultTWOptions = Omit<ChartingLibraryWidgetOptions, 'container'>

function getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

export const DEFAULT_TRADE_PAIR = 'BTCUSDT';

export const defaultTradingWidgetProps: DefaultTWOptions = {
    datafeed: api,
    interval: '5' as ResolutionString,
    library_path: '/charting_library/',
    symbol: DEFAULT_TRADE_PAIR,
    charts_storage_url: 'https://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studies_overrides: {},
    disabled_features: ['use_localstorage_for_settings'],
    enabled_features: ['study_templates'],
    locale: getLanguageFromURL() ?? 'ru',
    custom_css_url: '/charting_library/tradingviewRecolor.scss',
};
