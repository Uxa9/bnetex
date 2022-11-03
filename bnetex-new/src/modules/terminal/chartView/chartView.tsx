import classNames from 'classnames';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import styles from './chartView.module.scss';
import { useTheme } from 'lib/hooks/useTheme';

const ChartView = ({className}: {className?: string}) => {

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
                autosize={true}
                theme={theme === "dark" ? Themes.DARK : Themes.LIGHT}
            />
        </div>
    );
};

export default ChartView;
