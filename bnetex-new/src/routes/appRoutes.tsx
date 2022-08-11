import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';

const AppRoutes = () => {

    const { HOME, AUTH, REGISTRATION, P2P, TERMINAL, DASHBOARD, BUY_CRYPTO } = AppLinksEnum;

    return (
        <Routes>
            <Route index element={<Navigate to={HOME} />} />
            <Route path={HOME}></Route>
            <Route path={AUTH}></Route>
            <Route path={REGISTRATION}></Route>
            <Route path={TERMINAL}></Route>
            <Route path={DASHBOARD}></Route>
            <Route path={P2P}></Route>
            <Route path={BUY_CRYPTO}></Route>
        </Routes>
    );
};

export default AppRoutes;
