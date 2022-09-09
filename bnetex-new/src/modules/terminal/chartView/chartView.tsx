import classNames from 'classnames';
import TradingViewWidget from 'react-tradingview-widget';
import styles from './chartView.module.scss';

const ChartView = ({className}: {className?: string}) => {

    return (
        <div
            className={classNames(
                styles['chart-container'],
                className
            )}
        >
            <TradingViewWidget 
                symbol="BINANCE:BTCUSDT"
                autosize={true}
            />
        </div>
    );
};

export default ChartView;
