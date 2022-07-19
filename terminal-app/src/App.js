import { useState, useEffect, useRef } from 'react';

import Button from './components/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/popUp';

import Info from './images/icons/info';

import _l from './locales/index';

import './styles/style.scss';

const App = () => {
    const [lever, setLever] = useState(1);
    const [sliderLever, showSliderLever] = useState(false);
    const slider = useRef(null);

    const lowerLever = () => {
        if ( lever > 1 ) {
            setLever(Number(lever) -1);
        }
    }

    const upperLever = () => {
        if ( lever < 125 ) {
            setLever(Number(lever) +1);
        }
    }
    
    useEffect(() => {
        slider.current.value = lever;
        slider.current.style.background = 'linear-gradient(to right, #9043CA 0%, #9043CA ' + lever/1.25 + '%, #F9F1FF ' + lever/1.25 + '%, #F9F1FF 100%)';
    }, [lever]);

    return (
        <>
            <Header />
            <PopUp 
                title={_l.credit_lever_title}
            >
                <span
                    className="credit-lever-header"
                >
                    {_l.credit_lever_header}
                </span>
                <div
                    className="credit-lever-display"
                >
                    <div 
                        className="minus-icon"
                        onClick={lowerLever}
                    />
                    <div
                        className="credit-lever-level"
                    >
                        {lever}x
                    </div>
                    <div
                        className="plus-icon"
                        onClick={upperLever}
                    />
                </div>
                <div
                    className="slider-lever-container"
                    style={{
                        opacity: sliderLever ? 1 : 0,
                        marginLeft: `${lever/1.32}%`
                    }}
                >
                    <span>
                        {lever}x
                    </span>
                </div>
                <input
                    type='range'
                    min={1}
                    max={125}
                    defaultValue={1}
                    list="leverageList"
                    onChange={e => setLever(e.target.value)}
                    onMouseEnter={() => showSliderLever(true)}
                    onMouseLeave={() => showSliderLever(false)}
                    className="lever-range-selector"
                    ref={slider}
                />
                <datalist
                    className="leverage-list"
                    id="leverageList"
                >
                    <option
                        value={1}
                        label="1x"
                        className={
                            `${lever > 1 && 'passed'}`
                        }
                        onClick={() => setLever(1)}
                    />
                    <option
                        value={25}
                        label="25x"
                        className={
                            `${lever > 25 && 'passed'}`
                        }
                        onClick={() => setLever(25)}
                    />
                    <option
                        value={50}
                        label="50x"
                        className={
                            `${lever > 50 && 'passed'}`
                        }
                        onClick={() => setLever(50)}
                    />
                    <option
                        value={75}
                        label="75x"
                        className={
                            `${lever > 75 && 'passed'}`
                        }
                        onClick={() => setLever(75)}
                    />
                    <option
                        value={100}
                        label="100x"
                        className={
                            `${lever > 100 && 'passed'}`
                        }
                        onClick={() => setLever(100)}
                    />
                    <option
                        value={125}
                        label="125x"
                        className={
                            `${lever > 125 && 'passed'}`
                        }
                        onClick={() => setLever(125)}
                    />
                </datalist>
                <div
                    className="lever-info"
                >
                    <ul>
                        <li
                            style={{
                                maxHeight: lever > 1 ? "none" : 0
                            }}
                        >
                            <span>
                                {`${_l.credit_lever_warning_first} `}
                            </span>
                            <b>
                                250,000 USDT
                            </b>
                        </li>
                        <li>
                            {_l.credit_lever_warning_second}
                        </li>
                    </ul>
                    <div
                        className="lever-warn"
                    >
                        <Info 
                            height='25px'
                            width='25px'
                        />
                        <span>
                            {_l.credit_lever_warning_third}
                        </span>
                    </div>
                </div>
            </PopUp>
        </>
    );
}

export default App;
