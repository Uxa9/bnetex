import { useState, useEffect, useRef } from 'react';

import Button from './components/common/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/common/popUp';

import LeverPopUp  from './components/leverPopUp';
import MarginPopUp from './components/marginPopUp';

import Info from './images/icons/info';

import _l from './locales/index';

import './styles/style.scss';

import BeginnerTerminal from './components/terminal/beginnerTerminal';

const App = props => {
    const [switcher, setSwitcher]   = useState(false);
    const [margin, setMargin]       = useState("cross");
    const [lever, setLever]         = useState(20);
    const [tradeType, setTradeType] = useState("market");

    const [marginPopUp, showMarginPopUp] = useState(false);
    const [leverPopUp,  showLeverPopUp]  = useState(false);

    const acceptMarginPopUp = margin => {
        setMargin(margin);
        showMarginPopUp(false);
    }

    const closeMarginPopUp = () => {
        showMarginPopUp(false);
    }

    const acceptLeverPopUp = lever => {
        setLever(lever);
        showLeverPopUp(false);
    }

    const closeLeverPopUp = () => {
        showLeverPopUp(false);
    }

    return (
        <div
            className="page-wrapper"
        >
            <Header />
            {marginPopUp &&
                <MarginPopUp
                    acceptFunc={acceptMarginPopUp}
                    closeFunc={closeMarginPopUp}
                    type={margin}
                />
            }
            {leverPopUp &&
                <LeverPopUp
                    acceptFunc={acceptLeverPopUp}
                    closeFunc={closeLeverPopUp}
                    lever={lever}
                />
            }
            <div
                className="content-wrapper"
            >
                <div
                    className="chart-and-terminal"
                >
                    <div
                        className="chart-view"
                    >
                        когда-нибудь тут что-то будет
                    </div>
                    <BeginnerTerminal
                        margin={margin}
                        lever={lever}
                        evokeMarginSelector={() => showMarginPopUp(true)}
                        evokeLeverSelector={() => showLeverPopUp(true)}
                    />
                </div>
                <div
                    className="history-and-actives"
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
