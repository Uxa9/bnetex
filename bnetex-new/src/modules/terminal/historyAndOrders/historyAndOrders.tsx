import { useState, useEffect } from 'react';
import classNames from 'classnames';


import styles from "./historyAndOrders.module.scss";

type activeSectionType = 
    'positions'      | 
    'open_orders'    | 
    'orders_history' | 
    'trade_history';

interface historyAndOrdersSection{
    section: activeSectionType,
    title: string
}

const historyAndOrdersSection: historyAndOrdersSection[] = [
    {
        section: 'positions',
        title: 'Позиции',
    },
    {
        section: 'open_orders',
        title: 'Открытые ордера',
    },
    {
        section: 'orders_history',
        title: 'История оредеров',
    },
    {
        section: 'trade_history',
        title: 'История сделок',
    },
];

const HistoryAndOrders = () => {

    const [activeSection, setActiveSection] = useState<activeSectionType | undefined>(undefined);

    useEffect(() => {
        setActiveSection(historyAndOrdersSection[0].section);
    }, []);

    return (
        <div
            className={classNames('block', styles['history-and-orders'])}
        >
            <div
                className={styles.tabs}
            >
                histAndOrders
            </div>
        </div>
    )
}

export default HistoryAndOrders;