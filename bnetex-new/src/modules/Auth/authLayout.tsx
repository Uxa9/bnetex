import { Navigate, useLocation } from 'react-router-dom';
import styles from './authLayout.module.scss';
import { lazy, Suspense, useCallback } from 'react';
import { authBlurItems } from './blurItems';
import AuthAbstractImagery from './components/authAbstractImagery';
import FormCardSkeleton from './components/FormCard/formCardSkeleton';
import { AppLinksEnum } from 'routes/appLinks';
import Blur, { BlurProps } from 'modules/Global/components/blurredBackgroundItem';

const Login = lazy(() => import('modules/Auth/sections/login'));
const Registration = lazy(() => import('modules/Auth/sections/registration'));
const RegistrationFinalize = lazy(() => import('modules/Auth/sections/registrationFinalize'));
const EmailValidation = lazy(() => import('modules/Auth/sections/emailValidation'));

const AuthLayout = () => {
    const { pathname } = useLocation();

    const { REGISTRATION, LOGIN, AUTH, REGISTRATION_FINALIZE, VERIFY_EMAIL } = AppLinksEnum;

    const loadSection = useCallback(() => {
        const authSectionPath = pathname.split('/').at(-1);
        switch (authSectionPath) {
            case REGISTRATION: {
                return <Registration />;
            }
            case REGISTRATION_FINALIZE:{
                return <RegistrationFinalize />;
            }
            case VERIFY_EMAIL: {
                return <EmailValidation />;
            }
            case LOGIN:
            case AUTH: {
                return <Login />;
            }
            default: {
                return <Navigate to={`/${AppLinksEnum.NOT_FOUND_404}`} />;
            }
        }
    }, [ pathname ]);

    return (
        <main className={styles.layout}>
            <div className={styles.container}>
                {
                    authBlurItems.map((item: BlurProps, index: number) => 
                        <Blur 
                            key={index}
                            {...item} 
                        />
                    )
                }
                <Suspense  fallback={<FormCardSkeleton />}>
                    { loadSection() }
                </Suspense>
                <AuthAbstractImagery />
            </div>
        </main>
    );
};

export default AuthLayout;
