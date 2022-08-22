import ChartView from './chartView/chartView';
import HistoryAndOrders from './historyAndOrders/historyAndOrders'; 

import { Outlet } from 'react-router-dom';

import styles from './terminalLayout.module.scss';

const TerminalLayout = () => {

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
    )
}

export default TerminalLayout;