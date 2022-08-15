import { FC, useState } from 'react';

// import {ReactComponent as NightMode} from '../assets/images/icons/nightMode.svg'; 
import {ReactComponent as Wallet}    from '../assets/images/icons/wallet.svg';
import {ReactComponent as User}      from '../assets/images/icons/user.svg';
import {ReactComponent as Logo}      from '../assets/images/icons/logo.svg';

import _l from '../locales/index';
import { useNavigate } from 'react-router-dom';
import { Button } from 'lib/ui-kit';

// пока pro-режим отсутствует

// toDo
// декомпозировать ссылки в компоненте, провести рефактор!! 

interface HeaderProps{
    mode: 'beginner' | 'advanced',
}

const headerModes = {
    'beginner': _l.beginner_level,
    'advanced': _l.advanced_level,
}; 

const Header:FC<HeaderProps> = props => {
    const [modeSelect, openModeSelect] = useState<boolean>(false);

    const {mode} = props;

    const navigate = useNavigate();

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
                    <Logo 
                        onClick={() => navigate('/')}
                    />
                </div>
                <div                    
                    className={!modeSelect ? 
                        'custom-select' :
                        'custom-select select-active'
                    }
                    onMouseEnter={() => openModeSelect(true)}
                    onMouseLeave={() => openModeSelect(false)}
                >
                    <div
                        className="selected-mode"
                    >
                        {headerModes[mode]}
                        <div
                            className="select-arrow"
                        />
                    </div>
                    <div
                        className="select-dropdown"
                    >
                        <div
                            className={mode === 'beginner' ? 
                                'select-dropdown-option selected' : 
                                'select-dropdown-option'
                            }
                        >
                            {_l.beginner_level}
                        </div>
                        <div
                            className={mode === 'advanced' ? 
                                'select-dropdown-option selected' : 
                                'select-dropdown-option'
                            }
                        >
                            {_l.advanced_level}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="header-right-side"
            >
                {/* <div>
                    <NightMode 
                        height='22px'
                        width='22px'
                    />
                </div> */}
                <div>
                    <Wallet 
                        height='22px'
                        width='22px'
                    />
                    <span>
                        {_l.wallets}
                    </span>
                </div>
                <div>
                    <User
                        height='22px'
                        width='22px' 
                    />
                    <span>
                        {_l.profile}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
