import HistoryAndOrders from './historyAndOrders/historyAndOrders';
import { Outlet } from 'react-router-dom';
import styles from './terminalLayout.module.scss';
import { useActions } from 'lib/hooks/useActionCreators';
import { useEffect } from 'react';
import TradingViewWidget from 'modules/TradingView/TradingViewWidget';
import clsx from 'clsx';

const TerminalLayout = () => {

    const { setIsTerminalOpen } = useActions();

    useEffect(() => {
        setIsTerminalOpen(true);

        return () => {
            setIsTerminalOpen(false);
        };
    }, []);

    useEffect(() => {
        const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1d');

        socket.onopen = (e ) => {
            console.log(e);
        };

        socket.onmessage = (ev) => {
            console.log(JSON.parse(ev.data));
            console.log('message');
        };

        socket.onerror = (e ) => {
            console.log(e);
        };
    }, []);

    return (
        <div
            className={styles['content-wrapper']}
        >
            <TradingViewWidget
                className={clsx(styles.chart, 'card')}
            />
            <HistoryAndOrders
                className={styles.history}
            />
            <Outlet />
        </div>
    );
};

export default TerminalLayout;
