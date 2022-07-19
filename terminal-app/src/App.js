import { useState, useEffect, useRef } from 'react';

import Button from './components/common/button';
import Header from './components/pageTemplate/header';
import PopUp  from './components/common/popUp';

import LeverPopUp from './components/leverPopUp';

import Info from './images/icons/info';

import _l from './locales/index';

import './styles/style.scss';

const App = props => {
    const [switcher, setSwitcher] = useState(false);
    
    return (
        <>
            <Header />
        </>
    );
}

export default App;
