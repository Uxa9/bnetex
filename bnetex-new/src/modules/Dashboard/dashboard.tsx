import classNames from 'classnames';
import Header from 'components/header';
import { Button } from 'lib/ui-kit';
import { Link, Outlet } from 'react-router-dom';
import styles from './dashboard.module.scss';

import Chart from 'react-apexcharts';
import { useState } from 'react';

const Dashboard = () => {

    const [options, setOptions] = useState({
        dataLabels: {enabled: false},
        labels: ["Основной аккаунт", "Фьючерсы USD-M"],
        colors : ['#EA018D', '#5072F7']
    });

    const [series, setSeries] = useState([80, 20]);

    return(
        <>
            <Header mode='beginner' />
            <div className={styles.wrapper}>

                <main className={styles.dashboard}>
                    <aside className={classNames(styles['control-menu'], 'card')}>
                        <Link to={'tools'} className={styles.link}>
                            Панель инструментов
                        </Link>
                        <Link to={'settings'} className={styles.link}>
                             Настройки
                        </Link>
                        <div className={styles.separator} ></div>
                        <Link to={'wallet/main'} className={styles.link}>
                            Основной кошелек
                        </Link>
                        <Link to={'wallet/futures'} className={styles.link}>
                            Фьючерсный кошелек
                        </Link>
                        <Link to={'transactions'} className={styles.link}>
                            История транзакций
                        </Link>
                    </aside>
                    <Outlet />
                </main>
            </div>
        </>

    );
};

export default Dashboard;
