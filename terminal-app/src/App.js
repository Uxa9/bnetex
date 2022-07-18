import { useState, useEffect } from 'react';

import Button from './components/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/popUp';

import './styles/style.scss';

const App = () => {
    const [lever, setLever] = useState(1);
    const [sliderLever, showSliderLever] = useState(false);

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

    }, [lever]);

    return (
        <>
            <Header />
            <PopUp 
                title="Изменить кредитное плечо"
            >
                <span
                    className="credit-lever-header"
                >
                    Кредитное плечо
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
                >
                    {sliderLever &&
                        <span>
                            {lever}x
                        </span>
                    }
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
                />
                <datalist
                    className="leverage-list"
                    id="leverageList"
                >
                    <option
                        value={1}
                        label="1x"
                    />
                    <option
                        value={25}
                        label="25x"
                    />
                    <option
                        value={50}
                        label="50x"
                    />
                    <option
                        value={75}
                        label="75x"
                    />
                    <option
                        value={100}
                        label="100x"
                    />
                    <option
                        value={125}
                        label="125x"
                    />
                </datalist>
            </PopUp>
        </>
    );
}

export default App;
