import PageLayout from 'components/pageLayout';
import TerminalLayout from 'modules/terminal/terminalLayout';
import InvestorView from 'modules/terminal/investor/investorView';
import Dashboard from 'modules/Dashboard/dashboard';
// import FuturesWallet from 'modules/Dashboard/futuresWallet/futuresWallet';
import MainWallet from 'modules/Dashboard/mainWallet/mainWallet';
import Settings from 'modules/Dashboard/settings/settings';
import Tools from 'modules/Dashboard/tools/tools';
import MainPage from 'modules/MainPage/MainPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';
import InvestorWallet from 'modules/Dashboard/investorWallet/investorWallet';
import AuthLayout from 'modules/Auth/authLayout';
import Login from 'modules/Auth/Login/login';
import Transactions from 'modules/Dashboard/transactions/transactions';
import Registration from 'modules/Auth/Registration/registration';
import Deposit from 'modules/Payments/Deposit/deposit';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';

const AppRoutes = () => {

    const { HOME, AUTH, REGISTRATION, LOGIN, P2P, TERMINAL, DASHBOARD, DEPOSIT } = AppLinksEnum;
    const { isAuth } = useTypedSelector(state => state.auth);

    return (
        <Routes>
            <Route element={<PageLayout />}>
                <Route index element={<Navigate to={HOME} />} />
                <Route path={HOME} element={<MainPage />}></Route>
                {/* <Route path={AUTH}>
                    <Route path={REGISTRATION}>
                        <Route index element={<Registration.StepOne />} />
                        <Route path='verification' element={<Registration.StepTwo />} />
                        <Route path='success' element={<Registration.Success />} />
                    </Route>
                </Route> */}
                <Route path={TERMINAL} element={<TerminalLayout />}>
                    <Route path="investor" element={<InvestorView />} />
                </Route>
                <Route path={DASHBOARD} element={isAuth ? <Dashboard /> : <Navigate to={`/${AUTH}`} />}>
                    <Route index element={<Navigate to={'tools'} />}></Route>
                    <Route path='tools' element={<Tools />} />
                    <Route path='settings' element={<Settings />} />
                    <Route path='wallet/main' element={<MainWallet />} />
                    {/* <Route path='wallet/futures' element={<FuturesWallet />} /> */}
                    <Route path='wallet/investor' element={<InvestorWallet />} />
                    <Route path='transactions' element={<Transactions />} />
                </Route>
                <Route path={AUTH} element={<AuthLayout />}>
                    <Route index element={<Navigate to={LOGIN} />}></Route>
                    <Route path={REGISTRATION} element={<Registration />}></Route>
                    <Route path={LOGIN} element={<Login />}></Route>
                </Route>
                <Route path={P2P}></Route>
                <Route path={DEPOSIT} element={<Deposit />}></Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
