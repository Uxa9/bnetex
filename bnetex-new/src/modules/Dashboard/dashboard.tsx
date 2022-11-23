import clsx from 'clsx';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppColorsArray } from 'lib/types/appColors';
import IconLinkButton from 'lib/ui-kit/iconLinkButton/iconLinkButton';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AppLinksEnum } from 'routes/appLinks';
import styles from './dashboard.module.scss';
import { ActiveSectionType, dashboardSections, DashboardSection } from './dashboardSections';

const Tools = lazy(() => import('modules/Dashboard/sections/tools/tools'));
const Transactions = lazy(() => import('modules/Dashboard/sections/transactions/transactions'));
const Settings = lazy(() => import('modules/Dashboard/sections/settings/settings'));
const InvestorWallet = lazy(() => import('modules/Dashboard/sections/investorWallet/investorWallet'));
const MainWallet = lazy(() => import('modules/Dashboard/sections/mainWallet/mainWallet'));

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState<ActiveSectionType | undefined>(undefined);
    const { pathname } = useLocation();
    const { TOOLS, SETTINGS, MAIN_WALLET, INVESTOR_WALLET, TRANSACTIONS, DASHBOARD } = AppLinksEnum;
    const { goToState } = useGoToState();

    useEffect(() => {
        setActiveSection('tools'); //toDo костыль, передалать
        dashboardSections.forEach((section: DashboardSection) => {
            if (pathname.match(section.link)) {
                setActiveSection(section.link);
                return;
            }
        });
    }, [ pathname ]);

    const loadSection = useCallback(() => {
        const authSectionPath = pathname.split('/').at(-1);
        switch (authSectionPath) {
            case TRANSACTIONS: {
                return <Transactions />;
            }
            case SETTINGS: {
                return <Settings />;
            }
            case INVESTOR_WALLET.split('/').at(-1): {
                return <InvestorWallet />;
            }
            case MAIN_WALLET.split('/').at(-1): {
                return <MainWallet />;
            }
            case TOOLS:
            case DASHBOARD: {
                return <Tools />;
            }
            default: {
                return <Navigate to={`/${AppLinksEnum.NOT_FOUND_404}`} />;
            }
        }
    }, [ pathname ]);

    return(
        <>
            <div className={'wrapper'}>
                <main className={clsx('container', styles.dashboard)}>
                    <aside className={clsx(styles['control-menu'], 'card', 'scroll')}>
                        {
                            dashboardSections.map((section: DashboardSection, index: number) => 
                                <>
                                    <Link 
                                        key={section.link}
                                        to={section.link}
                                        className={clsx(
                                            styles['link'],
                                            { [styles['link--active']] : activeSection === section.link},
                                            'text',
                                        )}
                                        onClick={() => setActiveSection(section.link)}
                                    >
                                        {section.title}
                                    </Link>
                                    <IconLinkButton 
                                        key={section.link}
                                        label={section.title} 
                                        color={AppColorsArray[index]} 
                                        Icon={section.icon}     
                                        active={activeSection === section.link}    
                                        className={styles['link-icon']}  
                                        onClick={() => {
                                            setActiveSection(section.link);
                                            goToState(section.link, null, true);
                                        }}
                                    />
                                </>
                            )
                        }
                    </aside>
                    <Suspense  fallback={<Skeleton height={'50px'} />}>
                        { loadSection() }
                    </Suspense>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
