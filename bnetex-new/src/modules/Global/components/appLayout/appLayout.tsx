import Toaster from 'lib/ui-kit/toast/toaster/toaster';
import { Outlet } from 'react-router-dom';
import Header from '../Header/header';
// Сюда если что воткнем футер или еще что-то глобальное

const AppLayout = () => {
    return (
        <>
            <Header />
            <Toaster />
            <Outlet />
        </>
    );
};

export default AppLayout;
