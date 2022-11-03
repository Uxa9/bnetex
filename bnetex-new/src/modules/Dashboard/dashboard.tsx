import classNames from 'classnames';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

    useEffect(() => {
        setActiveSection('tools'); // костыль, передалать
        dashboardSections.forEach((section: DashboardSection) => {
            if (pathname.match(section.link)) {
                setActiveSection(section.link);
                return;
            }
        });
    }, [ pathname ]);

    const loadSection = useCallback(() => {
        const authSectionPath = pathname.split('/')[2];
        switch (authSectionPath) {
            case 'transactions': {
                return <Transactions />;
            }
            case 'settings':{
                return <Settings />;
            }
            case 'investor-wallet': {
                return <InvestorWallet />;
            }
            case 'main-wallet': {
                return <MainWallet />;
            }
            case 'tools':
            default: {
                return <Tools />;
            }
        }
    }, [ pathname ]);

    return(
        <>
            <div className={'wrapper'}>
                <main className={classNames('container', styles.dashboard)}>
                    <aside className={classNames(styles['control-menu'], 'card', 'scroll')}>
                        {
                            dashboardSections.map((section: DashboardSection) => 
                                <Link 
                                    key={section.link}
                                    to={section.link}
                                    className={classNames(
                                        styles.link,
                                        { [styles['link--active']] : activeSection === section.link},
                                        'text',
                                    )}
                                    onClick={() => setActiveSection(section.link)}
                                >
                                    {section.title}
                                </Link>
                            )
                        }
                    </aside>
                    <div
                        className={styles['dashboard-content']}
                    >
                        <Suspense  fallback={<Skeleton height={'50px'} />}>
                            { loadSection() }
                        </Suspense>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
