import ChartView from './chartView/chartView';
import HistoryAndOrders from './historyAndOrders/historyAndOrders'; 
import { Outlet } from 'react-router-dom';
import styles from './terminalLayout.module.scss';
import { useActions } from 'lib/hooks/useActionCreators';
import { useEffect } from 'react';

const TerminalLayout = () => {

    const { setIsTerminalOpen } = useActions();

    useEffect(() => {
        setIsTerminalOpen(true);

        return () => {
            setIsTerminalOpen(false);
        }; 
    }, []);

    return (
        <div
            className={styles['content-wrapper']}
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
