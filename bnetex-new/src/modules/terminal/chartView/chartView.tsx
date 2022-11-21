import classNames from 'classnames';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import styles from './chartView.module.scss';
import { useTheme } from 'lib/hooks/useTheme';
import { useEffect } from 'react';

const ChartView = ({className}: {className?: string}) => {

    useEffect(() => {
        // const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker_1h');

        // socket.onopen = (event: Event) => {
        //     console.log('Соединение установлено');
        //     console.log(event);
        // };

        // socket.onmessage = (event: MessageEvent) => {
        //     console.log('С сервера получены данные');
        //     console.log(JSON.parse(event.data));
        // };
    }, []);

    const { theme } = useTheme();
    return (
        <div
            className={classNames(
                styles['chart-container'],
                'card',
                className
            )}
        >
            <TradingViewWidget 
                symbol="BINANCE:BTCUSDT"
                autosize
                theme={Themes[theme.toUpperCase()]}
            />
        </div>
    );
};

export default ChartView;
