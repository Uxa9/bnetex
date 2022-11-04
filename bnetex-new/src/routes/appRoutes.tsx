import PageLayout from 'modules/Global/components/appLayout/appLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';
import { lazy, Suspense, useEffect } from 'react';
import useAuthActions from 'services/auth';
import { useActions } from 'lib/hooks/useActionCreators';
import AppLoader from 'modules/Global/components/appLoader/appLoader';
import { ProtectedRoute } from './protectedRoute';
import Page404 from 'modules/Global/pages/404/page404';

const MainPage = lazy(() => import('modules/MainPage/MainPage'));
const AuthLayout = lazy(() => import('modules/Auth/authLayout'));
const Dashboard = lazy(() => import('modules/Dashboard/dashboard'));
const Deposit = lazy(() => import('modules/Payments/Deposit/deposit'));
const Withdraw = lazy(() => import('modules/Payments/Withdraw/withdraw'));
const WithdrawConfirm = lazy(() => import('modules/Payments/Withdraw/confirm'));
const TerminalLayout = lazy(() => import('modules/terminal/terminalLayout'));
const InvestorView = lazy(() => import('modules/terminal/investor/investorView'));

const AppRoutes = () => {

    const { HOME, AUTH, TERMINAL, DASHBOARD, DEPOSIT, WITHDRAW, WITHDRAW_CONFIRM, NOT_FOUND_404 } = AppLinksEnum;
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
                        path={`${DASHBOARD}/*`} 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    >
                    </Route>
                    <Route path={`${AUTH}/*`} element={<AuthLayout />} />
                    <Route path={DEPOSIT} element={<Deposit />}></Route>
                    <Route path={WITHDRAW} element={<Withdraw />}></Route>
                    <Route path={WITHDRAW_CONFIRM} element={<WithdrawConfirm />} />
                    <Route path={NOT_FOUND_404} element={<Page404 />} />
                    <Route path={'*'} element={<Navigate to={NOT_FOUND_404} />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
