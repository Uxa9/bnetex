import { useTheme } from 'lib/hooks/useTheme';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { capitalizeFirstLetter } from 'lib/utils/capitalizeString';
import { useEffect, useRef, useState } from 'react';
import {
    widget,
    ChartingLibraryWidgetOptions,
    IChartingLibraryWidget,
    ThemeName,
} from '../../charting_library';
import { getOverrides } from './colorOverrides';
import { forbiddenMarkResolutions } from './api/types';
import { useParams } from 'react-router-dom';
import { defaultTradingWidgetProps } from './defaultProps';
import { useBinanceSocket } from 'lib/hooks/useBinanceSocket/useBinanceSocket';

interface TradingViewWidgetProps {
    className?: string;
}

const TradingViewWidget = ({ className }: TradingViewWidgetProps) => {
    const widgetRef = useRef<HTMLDivElement | null>(null);
    const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
    const { theme } = useTheme();
    const { pair } = useParams();
    const { markRefreshFlag } = useTypedSelector(state => state.algotrade);
    const { setSocketType, setTradePair } = useBinanceSocket();

    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }
        setTradePair('BTCUSDT');
        setSocketType('trader');

        const options: ChartingLibraryWidgetOptions = {
            ...defaultTradingWidgetProps,
            symbol: pair ?? defaultTradingWidgetProps.symbol as string,
            container: widgetRef.current,
            theme: capitalizeFirstLetter(theme) as ThemeName,
            overrides: getOverrides(),
        };

        const constructedWidget = new widget(options);

        // навешиваем слушаетель события на смену resolution
        // если выбран 1d или 3d - очистить маркеры
        constructedWidget?.onChartReady(() => {
            constructedWidget.activeChart().onIntervalChanged().subscribe(null,
                (interval) => {
                    const isResolutionForbidden = !!forbiddenMarkResolutions.find(it => it === interval);
                    if (isResolutionForbidden) constructedWidget.activeChart().clearMarks();
                });

            constructedWidget.activeChart().onSymbolChanged().subscribe(null,
                () => {
                    console.log(constructedWidget.activeChart().symbol());
                }
            );
        });

        setTvWidget(constructedWidget);

        return () => {
            if (tvWidget !== null) {
                tvWidget.remove();
                localStorage.removeItem('history');
            }
        };

    }, [ theme, pair ]);

    // при изменении интервала времени в истории торгов запрашивать marks
    useEffect(() => {
        tvWidget?.onChartReady(() => {
            tvWidget.activeChart().clearMarks();
            tvWidget.activeChart().refreshMarks();
        });

    }, [markRefreshFlag, tvWidget]);

    return (
        <div
            ref={widgetRef}
            className={className}
        />
    );
};

export default TradingViewWidget;
