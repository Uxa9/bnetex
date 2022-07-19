import { useState } from 'react';

import PopUp  from './common/popUp';

import _l from '../locales/index';

import '../styles/style.scss';

const MarginPopUp = props => {
    const [switcher, setSwitcher] = useState(false);
    
    return (
        <PopUp
            title={_l.margin_mode}
            confirmType={props.hasOrder ? "disabled" : "primary"}
        >
            <div
                className='margin-selector'
            >
                <div
                    className={`${!switcher && 'active'}`}
                    onClick={() => setSwitcher(false)}
                >
                    {_l.margin_cross}
                </div>
                <div
                    className={`${switcher && 'active'}`}
                    onClick={() => setSwitcher(true)}
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
