import Dashboard from 'modules/Dashboard/dashboard';
import Settings from 'modules/Dashboard/settings/settings';
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
            <Route path={TERMINAL}></Route>
            <Route path={DASHBOARD} element={<Dashboard />}>
                <Route index element={<Navigate to={'tools'} />}></Route>
                <Route path='tools' />
                <Route path='settings' element={<Settings />} />
                <Route path='wallet/main' />
                <Route path='wallet/futures' />
                <Route path='transactions' />
            </Route>
            <Route path={P2P}></Route>
            <Route path={BUY_CRYPTO}></Route>
        </Routes>
    );
};

export default AppRoutes;
