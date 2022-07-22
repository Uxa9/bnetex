import { useState, useEffect, useRef } from 'react';

import PopUp from './common/popUp';

import Info from '../images/icons/info';

import _l from '../locales/index';

import '../styles/style.scss';

const LeverPopUp = props => {
    const [lever, setLever] = useState(1);
    const [maxSum, setMaxSum] = useState(300000000);
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
        setLever(props.lever);
    }, []);
    
    useEffect(() => {
        slider.current.value = lever;
        slider.current.style.background = 
            'linear-gradient(to right, #9043CA 0%, #9043CA ' + 
            lever/1.25 + '%, #F9F1FF ' + 
            lever/1.25 + '%, #F9F1FF 100%)';

        if (lever >= 101) {
            setMaxSum(50000);
            return;
        }
        if (lever >= 51) {
            setMaxSum(250000);
            return;
        }
        if (lever >= 21) {
            setMaxSum(1000000);
            return;
        }
        if (lever >= 11) {
            setMaxSum(10000000);
            return;
        }
        if (lever >= 6) {
            setMaxSum(20000000);
            return;
        }
        if (lever >= 5) {
            setMaxSum(50000000);
            return;
        }
        if (lever >= 4) {
            setMaxSum(100000000);
            return;
        }
        if (lever >= 3) {
            setMaxSum(200000000);
            return;
        }
        if (lever >= 2) {
            setMaxSum(300000000);
            return;
        }
    }, [lever]);

    return (
        <PopUp 
            title={_l.credit_lever_title}
            closeFunc={props.closeFunc}
            acceptFunc={() => props.acceptFunc(lever)}
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
                            {`${_l.credit_lever_warning_first}`}
                        </span>
                        <b>
                            {`${maxSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} USDT`}
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
                        {`${_l.credit_lever_warning_third}`}
                    </span>
                </div>
            </div>
        </PopUp>
    );
}

export default LeverPopUp;
