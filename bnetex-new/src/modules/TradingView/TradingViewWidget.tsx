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
import { BinanceSymbol, forbiddenMarkResolutions } from './api/types';
import { useSearchParams } from 'react-router-dom';
import { defaultTradingWidgetProps } from './defaultProps';
import { useBinanceSocket } from 'lib/hooks/useBinanceSocket/useBinanceSocket';
import { validateTradePair } from './utils/validateTradePair';

interface TradingViewWidgetProps {
    className?: string;
}

const TradingViewWidget = ({ className }: TradingViewWidgetProps) => {
    const widgetRef = useRef<HTMLDivElement | null>(null);
    const [tvWidget, setTvWidget] = useState<IChartingLibraryWidget | null>(null);
    const { theme } = useTheme();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { markRefreshFlag } = useTypedSelector(state => state.algotrade);
    const { setTradePair, setTradePairAssets } = useBinanceSocket();

    // Создание tv-виджета. Выполняется единожды при монтировании компонента
    useEffect(() => {
        if (!widgetRef.current) return;

        constructTvWidget().then(setTvWidget);

        return () => {
            if (tvWidget !== null) {
                tvWidget.remove();
                localStorage.removeItem('history');
            }
        };
    }, []);

    const onTradePairUpdate = ({ symbol, baseAsset, quoteAsset }: BinanceSymbol) => {
        setTradePair(symbol);
        setSearchParams([[ 'tradePair', symbol ]]);
        setTradePairAssets({ baseAsset, quoteAsset });
    };

    const constructTvWidget = async () => {
        const tradePair = searchParams.get('tradePair');

        const options: ChartingLibraryWidgetOptions = {
            ...defaultTradingWidgetProps,
            symbol: await validateTradePair(tradePair)
                .then(pair => {
                    onTradePairUpdate(pair);
                    return pair.symbol;
                }),
            // мы гарантируем, что при вызове этой функции widgetRef.current !== null
            // функция может быть вызвана только после проверки на null
            container: widgetRef.current!,
            theme: capitalizeFirstLetter(theme) as ThemeName,
            overrides: getOverrides(),
        };

        const constructedWidget = new widget(options);

        constructedWidget?.onChartReady(() => {
            // навешиваем слушаетель события на смену resolution
            // если выбран 1d или 3d - очистить маркеры
            constructedWidget.activeChart().onIntervalChanged().subscribe(null, (interval) => {
                const isResolutionForbidden = !!forbiddenMarkResolutions.find(it => it === interval);
                if (isResolutionForbidden) constructedWidget.activeChart().clearMarks();
            });

            // при смене торговой пары обновляем URL, и tradePair для сокетов
            constructedWidget.activeChart().onSymbolChanged().subscribe(null, () => {
                const newTradePair = constructedWidget.activeChart().symbol();
                validateTradePair(newTradePair).then(onTradePairUpdate);
            });
        });

        return constructedWidget;
    };

    // при изменении интервала времени в истории торгов запрашивать marks
    useEffect(() => {
        tvWidget?.onChartReady(() => {
            tvWidget.activeChart().clearMarks();
            tvWidget.activeChart().refreshMarks();
        });
    }, [markRefreshFlag, tvWidget]);

    // Смена темы
    useEffect(() => {
        tvWidget?.onChartReady(() => {
            tvWidget.changeTheme(capitalizeFirstLetter(theme) as ThemeName).then(() => {
                tvWidget.applyOverrides(getOverrides());
            });
        });
    }, [theme, tvWidget]);

    return (
        <div
            ref={widgetRef}
            className={className}
        />
    );
};

export default TradingViewWidget;
