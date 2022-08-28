import { useState, useEffect } from 'react';
import classNames from 'classnames';

import _l from 'locales';

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
        // <div
        //     className={classNames('block', styles['history-and-orders'])}
        // >
            <div
                className={styles.tabs}
            >
                <div
                    className="block history-and-orders"
                >
                    <div
                        className="tabs"
                    >
                        <div
                            className="tab tab-active"
                        >
                            {_l.positions}
                            <div
                                className="tab-counter"
                            >
                                1
                            </div>
                        </div>
                        <div
                            className="tab"
                        >
                            {_l.open_orders}
                            <div
                                className="tab-counter"
                            >
                                2
                            </div>
                        </div>
                        <div
                            className="tab"
                        >
                            {_l.orders_history}
                        </div>
                        <div
                            className="tab"
                        >
                            {_l.deals_history}
                        </div>
                    </div>
                    <div
                        className="positions-table"
                    >
                        <div
                            className="position-header"
                        >
                            <span>
                                Символ
                            </span>
                            <span>
                                Размер
                            </span>
                            <span>
                                Цена входа
                            </span>
                            <span>
                                Цена маркировки
                            </span>
                            <span>
                                Цена ликвидации
                            </span>
                            <span>
                                Маржа
                            </span>
                            <span>
                                PnL
                            </span>
                            <span>
                                Закрыть все позиции
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default HistoryAndOrders;