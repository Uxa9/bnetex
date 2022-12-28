import clsx from 'clsx';
// import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import styles from './chartView.module.scss';
import { useTheme } from 'lib/hooks/useTheme';

const ChartView = ({className}: {className?: string}) => {

    const { theme } = useTheme();
    return (
        <div
            className={clsx(
                styles['chart-container'],
                'card',
                className
            )}
        >
            {/* <TradingViewWidget 
                symbol="BINANCE:BTCUSDT"
                autosize
                theme={Themes[theme.toUpperCase()]}
            /> */}
        </div>
    );
};

export default ChartView;
