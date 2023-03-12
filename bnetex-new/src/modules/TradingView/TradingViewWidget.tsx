import { useTheme } from 'lib/hooks/useTheme';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { capitalizeFirstLetter } from 'lib/utils/capitalizeString';
import { useEffect, useRef, useState } from 'react';
import {
    widget,
    ChartingLibraryWidgetOptions,
    LanguageCode,
    IChartingLibraryWidget,
    ThemeName,
} from '../../charting_library';
import { getOverrides } from './colorOverrides';
import { forbiddenMarkResolutions } from './api/types';
import { useParams } from 'react-router-dom';
import { defaultTradingWidgetProps } from './types';

function getLanguageFromURL(): LanguageCode | null {
    const regex = new RegExp('[\\?&]lang=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
}

interface TradingViewWidgetProps {
    className?: string;
}

const TradingViewWidget = ({className }: TradingViewWidgetProps) => {
    const widgetRef = useRef<HTMLDivElement | null>(null);
    const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
    const { theme } = useTheme();
    const { pair } = useParams();
    const { markRefreshFlag } = useTypedSelector(state => state.algotrade);

    useEffect(() => {
        if (!widgetRef.current) {
            return;
        }
        const options: ChartingLibraryWidgetOptions = {
            ...defaultTradingWidgetProps,
            symbol: pair ?? defaultTradingWidgetProps.symbol as string,
            container: widgetRef.current,
            locale: getLanguageFromURL() ?? 'ru',
            theme: capitalizeFirstLetter(theme) as ThemeName,
            overrides: getOverrides(),
        };

        const _widget = new widget(options);

        // навешиваем слушаетель события на смену resolution
        // если выбран 1d или 3d - очистить маркеры
        _widget?.onChartReady(() => {
            _widget.activeChart().onIntervalChanged().subscribe(null,
                (interval) => {
                    const isResolutionForbidden = !!forbiddenMarkResolutions.find(it => it === interval);

                    if (isResolutionForbidden) _widget.activeChart().clearMarks();
                });
        });

        setTvWidget(_widget);

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
