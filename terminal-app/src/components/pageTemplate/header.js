import { useState } from 'react';

import NightMode from "../../images/icons/nightMode";
import Wallet    from "../../images/icons/wallet";
import Case      from "../../images/icons/case";
import User      from "../../images/icons/user";
import logo      from "../../images/logo.svg";

import _l from '../../locales/index';

/**
 * 
 */
const Header = props => {
    const [modeSelect, openModeSelect] = useState(false);

    const mode = props.mode || 'beginner';

    const getSelectedMode = () => {
        if (mode == 'beginner') return _l.beginner_level;
        if (mode == 'advanced') return _l.advanced_level;
        if (mode == 'pro')      return _l.pro_level;     
    }

    return (
        <header
            className="page-header"
        >
            <div
                className="header-left-side"
            >
                <div
                    className="logo"
                >
                    <img src={logo} />
                </div>
                <div                    
                    className={!modeSelect ? 
                        "custom-select" :
                        "custom-select select-active"
                    }
                    onMouseEnter={() => openModeSelect(true)}
                    onMouseLeave={() => openModeSelect(false)}
                >
                    <div
                        className="selected-mode"
                    >
                        {getSelectedMode() || _l.beginner_level}
                        <div
                            className="select-arrow"
                        />
                    </div>
                    <div
                        className="select-dropdown"
                    >
                        <div
                            className={mode == "beginner" ? 
                                "select-dropdown-option selected" : 
                                "select-dropdown-option"
                            }
                        >
                            {_l.beginner_level}
                        </div>
                        <div
                            className={mode == "advanced" ? 
                                "select-dropdown-option selected" : 
                                "select-dropdown-option"
                            }
                        >
                            {_l.advanced_level}
                        </div>
                        <div
                            className={mode == "pro" ? 
                                "select-dropdown-option selected" : 
                                "select-dropdown-option"
                            }
                        >
                            {_l.pro_level}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="header-right-side"
            >
                <div>
                    <NightMode 
                        height='30px'
                        width='30px'
                    />
                </div>
                <div>
                    <Wallet 
                        height='30px'
                        width='30px'
                    />
                    <span>
                        {_l.wallets}
                    </span>
                </div>
                <div>
                    <Case
                        height='30px'
                        width='30px' 
                    />
                    <span>
                        {_l.deposits}
                    </span>
                </div>
                <div>
                    <User
                        height='30px'
                        width='30px' 
                    />
                    <span>
                        {_l.profile}
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header;