import PageLayout from 'components/pageLayout';
import TerminalLayout from 'modules/terminal/terminalLayout';
import InvestorView from 'modules/terminal/investor/investorView';
import Dashboard from 'modules/Dashboard/dashboard';
import FuturesWallet from 'modules/Dashboard/futuresWallet/futuresWallet';
import MainWallet from 'modules/Dashboard/mainWallet/mainWallet';
import Settings from 'modules/Dashboard/settings/settings';
import Tools from 'modules/Dashboard/tools/tools';
import MainPage from 'modules/MainPage/MainPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';
import InvestorWallet from 'modules/Dashboard/investorWallet/investorWallet';
import RadioButtonGroup from 'lib/ui-kit/radioButton/radioButtonGroup';
import SettingsMenu from 'components/Header/SettingsMenu';
import * as Registration from 'modules/Registration/index';

const AppRoutes = () => {

    const { HOME, AUTH, REGISTRATION, P2P, TERMINAL, DASHBOARD, BUY_CRYPTO } = AppLinksEnum;

    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<Navigate to={HOME} />} />
                <Route path={HOME} element={<MainPage />}></Route>
                <Route path={AUTH}></Route>
                <Route path={REGISTRATION}>
                    <Route index element={<Registration.StepOne />} />
                    <Route path='verification' element={<Registration.StepTwo />} />
                    <Route path='success' element={<Registration.Success />} />
                </Route>
                <Route path={TERMINAL} element={<TerminalLayout />}>
                    <Route path="investor" element={<InvestorView />} />
                </Route>
                <Route path={DASHBOARD} element={<Dashboard />}>
                    <Route index element={<Navigate to={'tools'} />}></Route>
                    <Route path='tools' element={<Tools />} />
                    <Route path='settings' element={<Settings />} />
                    <Route path='wallet/main' element={<MainWallet />} />
                    <Route path='wallet/futures' element={<FuturesWallet />} />
                    <Route path='wallet/investor' element={<InvestorWallet />} />
                    <Route path='transactions' />
                </Route>
                <Route path={P2P}></Route>
                <Route path={BUY_CRYPTO}></Route>
                <Route path='test' element={<SettingsMenu />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
