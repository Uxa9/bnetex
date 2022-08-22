import TradingViewWidget from 'react-tradingview-widget';


import styles from './chartView.module.scss';

const ChartView = () => {

    return (
        <div
            className={styles['chart-container']}
        >
            <TradingViewWidget 
                symbol="BINANCE:BTCUSDT"
                autosize={true}
            />
        </div>
    )
}

export default ChartView;