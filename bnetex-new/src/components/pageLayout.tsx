import Toast from 'lib/ui-kit/toast/toast';
import { Outlet } from 'react-router-dom';
import Header from './Header/header';

// Сюда если что воткнем футер или еще что-то глобальное

const PageLayout = () => {

    return (
        <>
            <Header />
            <Toast />
            <Outlet />
        </>
    );
};

export default PageLayout;
