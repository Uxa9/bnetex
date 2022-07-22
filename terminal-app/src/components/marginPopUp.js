import { useState, useEffect } from 'react';

import PopUp  from './common/popUp';

import _l from '../locales/index';

import '../styles/style.scss';

const MarginPopUp = props => {
    const [switcher, setSwitcher] = useState('cross');

    useEffect(() => {
        setSwitcher(props.type);
    }, []);
    
    return (
        <PopUp
            title={_l.margin_mode}
            confirmType={props.hasOrder ? "disabled" : "primary"}
            closeFunc={props.closeFunc}
            acceptFunc={() => props.acceptFunc(switcher)}
        >
            <div
                className='margin-selector'
            >
                <div
                    className={`${switcher == "cross" && 'active'}`}
                    onClick={() => setSwitcher('cross')}
                >
                    {_l.margin_cross}
                </div>
                <div
                    className={`${switcher == "isolated" && 'active'}`}
                    onClick={() => setSwitcher('isolated')}
                >
                    {_l.margin_isolated}
                </div>
            </div>
            <div
                className='margin-text'
            >
                <p>
                    {_l.margin_mode_warning_first}
                </p>
                <p>
                    <b>
                        {_l.margin_mode_warning_second_name}
                    </b>
                    {` ${_l.margin_mode_warning_second}`}
                </p>
                <p>
                    <b>
                        {_l.margin_mode_warning_third_name}
                    </b>
                    {` ${_l.margin_mode_warning_third}`}
                </p>
            </div>
        </PopUp>
    );
}

export default MarginPopUp;
