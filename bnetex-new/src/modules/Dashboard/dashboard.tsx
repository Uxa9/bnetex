import classNames from 'classnames';
import Header from 'components/header';
import { Link, Outlet } from 'react-router-dom';
import styles from './dashboard.module.scss';

const Dashboard = () => {

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
