import ChartView from './chartView/chartView';
import HistoryAndOrders from './historyAndOrders/historyAndOrders'; 

import { Outlet } from 'react-router-dom';

import styles from './terminalLayout.module.scss';
import { useActions } from 'lib/hooks/useActionCreators';
import { useEffect } from 'react';

const TerminalLayout = () => {

    const {setIsTerminalOpen} = useActions();

    useEffect(() => {
        setIsTerminalOpen(true);

        return () => {
            setIsTerminalOpen(false);
        }; 
    }, []);

    return (
        <div
            className="page-wrapper"
        >
            <div
                className={styles['content-wrapper']}
            >
                <div
                    className={styles['chart-and-history']}
                >
                    <ChartView />
                    <HistoryAndOrders />
                </div>
                <div
                    className={styles['terminal-and-actives']}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default TerminalLayout;
