import { ChartingLibraryWidgetOptions, ResolutionString } from 'charting_library/charting_library';
import api from './api/api';

type DefaultTWOptions = Omit<ChartingLibraryWidgetOptions, 'container'>

export const defaultTradingWidgetProps: DefaultTWOptions = {
    datafeed: api,
    symbol: 'BTCUSDT',
    interval: '5' as ResolutionString,
    library_path: '/charting_library/',
    charts_storage_url: 'https://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studies_overrides: {},
    disabled_features: ['use_localstorage_for_settings'],
    enabled_features: ['study_templates'],
    locale: 'ru',
    custom_css_url: '/charting_library/tradingviewRecolor.scss',
};
