import DynamicGrid from './components/DynamicGrid/dynamicGrid';
import styles from './LandingPage.module.scss';
import Greeting from './sections/greeting/greeting';

//toDo: пофиксить overflow страницы

const LandingPage = () => {
    return (
        <main className={styles['container']}>
            <DynamicGrid />
            <div className={styles['wrapper']}>
                <Greeting />
            </div>
        </main>
    );
};

export default LandingPage;
