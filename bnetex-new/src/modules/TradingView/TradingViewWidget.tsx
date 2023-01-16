import { useTheme } from 'lib/hooks/useTheme';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { capitalizeFirstLetter } from 'lib/utils/capitalizeString';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    widget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    IChartingLibraryWidget,
    ResolutionString,
    ThemeName,
    LibrarySymbolInfo,
    GetMarksCallback,
    Mark,
} from '../../charting_library';
import api from './api/api';
import { getOverrides } from './colorOverrides';
import getTVData from 'services/getTVData';
import { HistoryPeriod } from 'store/actions/algotrade';


export interface ChartContainerProps {
	symbol: ChartingLibraryWidgetOptions['symbol'];
	interval: ChartingLibraryWidgetOptions['interval'];

	// BEWARE: no trailing slash is expected in feed URL
	datafeedUrl: string;
	libraryPath: ChartingLibraryWidgetOptions['library_path'];
	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
	clientId: ChartingLibraryWidgetOptions['client_id'];
	userId: ChartingLibraryWidgetOptions['user_id'];
	fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
	autosize: ChartingLibraryWidgetOptions['autosize'];
	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
	container: ChartingLibraryWidgetOptions['container'];
}

function getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

const defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: 'BTCUSDT',
    interval: '5' as ResolutionString,
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
};

interface TradingViewWidgetProps extends Partial<ChartContainerProps> {
    className?: string;
}

const TradingViewWidget = (componentProps: TradingViewWidgetProps = defaultProps) => {
    const widgetRef = useRef<HTMLDivElement | null>(null);
    const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
    const { theme } = useTheme();
    const props = {...defaultProps, ...componentProps};
    const { historyPeriod } = useTypedSelector(state => state.algotrade);

    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }
        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: props.symbol as string,
            datafeed: api,
            interval: props.interval as ChartingLibraryWidgetOptions['interval'],
            container: widgetRef.current,
            library_path: props.libraryPath as string,

            locale: getLanguageFromURL() || 'ru',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: props.chartsStorageUrl,
            charts_storage_api_version: props.chartsStorageApiVersion,
            client_id: props.clientId,
            user_id: props.userId,
            fullscreen: props.fullscreen,
            autosize: props.autosize,
            studies_overrides: props.studiesOverrides,
            custom_css_url: '/src/modules/TradingView/tradingviewRecolor.scss',
            theme: capitalizeFirstLetter(theme) as ThemeName,
            overrides: getOverrides(),
        };

        setTvWidget(new widget(widgetOptions));

        return () => {
            if (tvWidget !== null) {
                tvWidget.remove();
            }
        };

    }, [ theme ]);

    useEffect(() => {
        localStorage.setItem('history', historyPeriod ? String(historyPeriod) : '');

        tvWidget?.onChartReady(() => {
            historyPeriod
                ? tvWidget.activeChart().refreshMarks()
                : tvWidget.activeChart().clearMarks();
        });
    }, [historyPeriod, tvWidget]);

    return (
        <div
            ref={widgetRef}
            className={props.className}
        />
    );
};

export default TradingViewWidget;
