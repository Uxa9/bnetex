import TerminalInterface from 'components/terminalInterface';
import Dashboard from 'modules/Dashboard/dashboard';
import FuturesWallet from 'modules/Dashboard/futuresWallet/futuresWallet';
import MainWallet from 'modules/Dashboard/mainWallet/mainWallet';
import Settings from 'modules/Dashboard/settings/settings';
import Tools from 'modules/Dashboard/tools/tools';
import MainPage from 'modules/MainPage/MainPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';

const AppRoutes = () => {

    const { HOME, AUTH, REGISTRATION, P2P, TERMINAL, DASHBOARD, BUY_CRYPTO } = AppLinksEnum;

    return (
        <Routes>
            <Route index element={<Navigate to={HOME} />} />
            <Route path={HOME} element={<MainPage />}></Route>
            <Route path={AUTH}></Route>
            <Route path={REGISTRATION}></Route>
            <Route path={TERMINAL} element={<TerminalInterface />}></Route>
            <Route path={DASHBOARD} element={<Dashboard />}>
                <Route index element={<Navigate to={'tools'} />}></Route>
                <Route path='tools' element={<Tools />}/>
                <Route path='settings' element={<Settings />} />
                <Route path='wallet/main' element={<MainWallet />} />
                <Route path='wallet/futures' element={<FuturesWallet />} />
                <Route path='transactions' />
            </Route>
            <Route path={P2P}></Route>
            <Route path={BUY_CRYPTO}></Route>
        </Routes>
    );
};

export default AppRoutes;
