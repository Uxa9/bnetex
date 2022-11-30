import ChartView from './chartView/chartView';
import HistoryAndOrders from './historyAndOrders/historyAndOrders';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './terminalLayout.module.scss';
import { useActions } from 'lib/hooks/useActionCreators';
import { useEffect, useState } from 'react';
import clsx from 'clsx';


const TerminalLayout = () => {

    const [layoutStyles, setLayoutStyles] = useState(clsx(styles['content-wrapper']))
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.split('/').pop() === 'trader') {
            setLayoutStyles(clsx(styles['content-wrapper'], styles['trader-view']));
        } else {
            setLayoutStyles(clsx(styles['content-wrapper']));
        }
    }, [location]);

    const { setIsTerminalOpen } = useActions();

    useEffect(() => {
        setIsTerminalOpen(true);

        return () => {
            setIsTerminalOpen(false);
        };
    }, []);

    return (
        <div
            className={layoutStyles}
        >
            <ChartView
                className={styles.chart}
            />
            <HistoryAndOrders
                className={styles.history}
            />
            <Outlet />
        </div>
    );
};

export default TerminalLayout;
