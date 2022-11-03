import { useLocation } from 'react-router-dom';
import styles from './authLayout.module.scss';
import Blur, { BlurProps } from 'components/blurredBackgroundItem';
import { lazy, Suspense, useCallback } from 'react';
import { authBlurItems } from './blurItems';
import AuthAbstractImagery from './components/authAbstractImagery';
import FormCardSkeleton from './components/FormCard/formCardSkeleton';

const Login = lazy(() => import('modules/Auth/sections/login'));
const Registration = lazy(() => import('modules/Auth/sections/registration'));
const RegistrationFinalize = lazy(() => import('modules/Auth/sections/registrationFinalize'));
const EmailValidation = lazy(() => import('modules/Auth/sections/emailValidation'));

const AuthLayout = () => {
    const { pathname } = useLocation();

    const loadSection = useCallback(() => {
        const authSectionPath = pathname.split('/')[2];
        switch (authSectionPath) {
            case 'signup': {
                return <Registration />;
            }
            case 'registration-finalize':{
                return <RegistrationFinalize />;
            }
            case 'email-verification': {
                return <EmailValidation />;
            }
            case 'login':
            default: {
                return <Login />;
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
