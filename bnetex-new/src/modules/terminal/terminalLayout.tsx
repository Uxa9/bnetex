import HistoryAndOrders from './historyAndOrders/historyAndOrders';
import TradingViewWidget from 'modules/TradingView/TradingViewWidget';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './terminalLayout.module.scss';
import { useActions } from 'lib/hooks/useActionCreators';
import { useEffect } from 'react';
import clsx from 'clsx';
import { BinanceSocketProvider } from 'lib/hooks/useBinanceSocket/useBinanceSocket';

const TerminalLayout = () => {

    const { pathname } = useLocation();
    const { setIsTerminalOpen } = useActions();

    useEffect(() => {
        setIsTerminalOpen(true);

        return () => {
            setIsTerminalOpen(false);
        };
    }, []);

    return (
        <BinanceSocketProvider>
            <div
                className={clsx(
                    styles['content-wrapper'],
                    /trader/.test(pathname) && styles['trader-view']
                )}
            >
                <TradingViewWidget
                    className={clsx(styles.chart, 'card')}
                />
                <HistoryAndOrders
                    className={styles.history}
                />
                <Outlet />
            </div>
        </BinanceSocketProvider>
    );
};

export default TerminalLayout;
