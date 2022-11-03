import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './dashboard.module.scss';

type activeSectionType = 'tools' | 'settings' | 'wallet/main' | 'wallet/investor' | 'transactions';

interface dashboardSection{
    link: activeSectionType,
    title: string
}

const dashboardSections: dashboardSection[] = [
    {
        link: 'tools',
        title: 'Панель инструментов',
    },
    {
        link: 'settings',
        title: 'Настройки',
    },
    {
        link: 'wallet/main',
        title: 'Основной кошелек',
    },
    {
        link: 'wallet/investor',
        title: 'Инвестиционный кошелек',
    },
    {
        link: 'transactions',
        title: 'История транзакций',
    },
];

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState<activeSectionType | undefined>(undefined);
    const location = useLocation();

    useEffect(() => {
        const url = window.location.href;
        dashboardSections.forEach((section: dashboardSection) => {
            if(url.match(section.link)){
                setActiveSection(section.link);
                return;
            }
        });
    }, [location.pathname]);

    return(
        <>
            <div className={'wrapper'}>
                <main className={classNames('container', styles.dashboard)}>
                    <aside className={classNames(styles['control-menu'], 'card', 'scroll')}>
                        {
                            dashboardSections.map((section: dashboardSection) => 
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
                        <Outlet />
                    </div>
                </main>
            </div>
        </>

    );
};

export default Dashboard;
