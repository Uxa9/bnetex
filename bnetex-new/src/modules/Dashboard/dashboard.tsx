import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './dashboard.module.scss';
import { ActiveSectionType, dashboardSections, DashboardSection } from './dashboardSections';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState<ActiveSectionType | undefined>(undefined);
    const { pathname } = useLocation();

    useEffect(() => {
        dashboardSections.forEach((section: DashboardSection) => {
            if(pathname.match(section.link)) {
                setActiveSection(section.link);
                return;
            }
        });
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
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
