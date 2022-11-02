import PageLayout from 'components/pageLayout';
import TerminalLayout from 'modules/terminal/terminalLayout';
import InvestorView from 'modules/terminal/investor/investorView';
import Dashboard from 'modules/Dashboard/dashboard';
import MainWallet from 'modules/Dashboard/mainWallet/mainWallet';
import Settings from 'modules/Dashboard/settings/settings';
import Tools from 'modules/Dashboard/tools/tools';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';
import InvestorWallet from 'modules/Dashboard/investorWallet/investorWallet';
import Transactions from 'modules/Dashboard/transactions/transactions';
import Deposit from 'modules/Payments/Deposit/deposit';
import Withdraw from 'modules/Payments/Withdraw/withdraw';
import WithdrawConfirm from 'modules/Payments/Withdraw/confirm';
import { lazy, Suspense, useEffect } from 'react';
import useAuthActions from 'services/auth';
import { useActions } from 'lib/hooks/useActionCreators';
import AppLoader from 'modules/Global/components/appLoader/appLoader';
import { ProtectedRoute } from './protectedRoute';

const MainPage = lazy(() => import('modules/MainPage/MainPage'));
const AuthLayout = lazy(() => import('modules/Auth/authLayout'));

const AppRoutes = () => {

    const { HOME, AUTH, TERMINAL, DASHBOARD, DEPOSIT, WITHDRAW, WITHDRAW_CONFIRM } = AppLinksEnum;
    const { loginUser, logoutUser } = useActions();
    const { verifyToken } = useAuthActions();

    // Тут супер говеное костыльное решение, потом пофиксим нормально, щас лень
    useEffect(() => {
        verifyToken()
            .then((response) => {
                const isTokenValid = response.data.valid;
                isTokenValid ? loginUser() : logoutUser();
            })
            .catch(() => logoutUser());
    });

    return (
        <Suspense fallback={<AppLoader />}>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route index element={<Navigate to={HOME} />} />
                    <Route path={HOME} element={<MainPage />}></Route>
                    <Route path={TERMINAL} element={<TerminalLayout />}>
                        <Route path="investor" element={<InvestorView />} />
                    </Route>
                    <Route 
                        path={DASHBOARD} 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to={'tools'} />}></Route>
                        <Route path='tools' element={<Tools />} />
                        <Route path='settings' element={<Settings />} />
                        <Route path='wallet/main' element={<MainWallet />} />
                        <Route path='wallet/investor' element={<InvestorWallet />} />
                        <Route path='transactions' element={<Transactions />} />
                    </Route>
                    <Route path={`${AUTH}/*`} element={<AuthLayout />} />
                    <Route path={DEPOSIT} element={<Deposit />}></Route>
                    <Route path={WITHDRAW} element={<Withdraw />}></Route>
                    <Route path={WITHDRAW_CONFIRM} element={<WithdrawConfirm />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
