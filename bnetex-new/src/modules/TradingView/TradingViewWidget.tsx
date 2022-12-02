import { useEffect, useRef, useState } from 'react';
import {
    widget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    IChartingLibraryWidget,
    ResolutionString,
} from '../../charting_library';
import api from './api/api';


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

export interface ChartContainerState {
}

function getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

const defaultProps: Omit<ChartContainerProps, 'container'> = {
    symbol: 'BTCUSDT',
    interval: 'D' as ResolutionString,
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
    
    const props = {...defaultProps, ...componentProps};

    // useEffect(() => {
    //     const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker_1h');

    //     socket.onopen = (event: Event) => {
    //         console.log('Соединение установлено');
    //         console.log(event);
    //     };

    //     socket.onmessage = (event: MessageEvent) => {
    //         console.log('С сервера получены данные');
    //         console.log(JSON.parse(event.data));
    //     };
    // }, []);

    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }
        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: props.symbol as string,
            // BEWARE: no trailing slash is expected in feed URL
            // tslint:disable-next-line:no-any
            datafeed: api,
            interval: props.interval as ChartingLibraryWidgetOptions['interval'],
            container: widgetRef.current,
            library_path: props.libraryPath as string,
            
            locale: getLanguageFromURL() || 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: props.chartsStorageUrl,
            charts_storage_api_version: props.chartsStorageApiVersion,
            client_id: props.clientId,
            user_id: props.userId,
            fullscreen: props.fullscreen,
            autosize: props.autosize,
            studies_overrides: props.studiesOverrides,
        };

        setTvWidget(new widget(widgetOptions));

        return () => {
            if (tvWidget !== null) {
                tvWidget.remove();
            }
        };

    }, []);

    useEffect(() => {
        if (!tvWidget) return;

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute('title', 'Click to show a notification popup');
                button.classList.add('apply-common-tooltip');
                button.addEventListener('click', () => tvWidget.showNoticeDialog({
                    title: 'Notification',
                    body: 'TradingView Charting Library API works correctly',
                    callback: () => {
                        console.log('Noticed!');
                    },
                }));
                button.innerHTML = 'Check API';
            });
        });
    }, [ tvWidget ]);
    
    return (
        <div
            ref={widgetRef}
            className={props.className}
        />
    );
};


export default TradingViewWidget;
