import { useState, useEffect, useRef } from 'react';

import Button from './components/UIKit/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/UIKit/popUp';

import LeverPopUp  from './components/leverPopUp';
import MarginPopUp from './components/marginPopUp';

import Info from './images/icons/info';

import _l from './locales/index';

import './styles/style.scss';

import AdvancedTerminal from './components/terminal/advancedTerminal';
import BeginnerTerminal from './components/terminal/beginnerTerminal';

const App = props => {
    const [switcher, setSwitcher]   = useState(false);

    return (
        <div
            className="page-wrapper"
        >
            <Header />
            <div
                className="content-wrapper"
            >
                <div
                    className="chart-and-history"
                >
                    <div
                        className="chart-view"
                    >
                        когда-нибудь тут что-то будет
                    </div>
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
                <AdvancedTerminal />
                <div
                    className="terminal-and-actives"
                >
                    <BeginnerTerminal />
                    <div
                        className="block actives"
                    >
                        <div
                            className="tabs"
                        >
                            <div
                                className="tab tab-active"
                            >
                                Активы
                            </div>
                            <div
                                className="tab"
                            >
                                Коэффициент маржи
                            </div>
                        </div>
                        <div
                            className='buttons'
                        >
                            <Button
                                type="primary"
                                width="180px"
                            >
                                Купить актив
                            </Button>
                            <Button
                                type="secondary"
                                width="180px"
                            >
                                Перевод средств
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
