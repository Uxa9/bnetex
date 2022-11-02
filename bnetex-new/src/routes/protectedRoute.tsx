import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import AppLoader from 'modules/Global/components/appLoader/appLoader';
import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { AppLinksEnum } from './appLinks';

export interface ProtectedRouteProps {
    children: JSX.Element;
}

export const ProtectedRoute = memo((props: ProtectedRouteProps) => {
    const { isAuth, loading } = useTypedSelector(state => state.auth);
    
    if (loading) {
        return <AppLoader />;
    }

    return (
        isAuth ? props.children : <Navigate to={`/${AppLinksEnum.LOGIN}`} />
    );
});
