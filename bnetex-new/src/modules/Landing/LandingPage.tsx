import DynamicGrid from './components/DynamicGrid/dynamicGrid';
import styles from './LandingPage.module.scss';
import Earn from './sections/earn/earn';
import Greeting from './sections/greeting/greeting';

//toDo: пофиксить overflow страницы

const LandingPage = () => {
    return (
        <main className={styles['container']}>
            <DynamicGrid />
            <div className={styles['wrapper']}>
                <Greeting />
                <Earn />
            </div>
        </main>
    );
};

export default LandingPage;
