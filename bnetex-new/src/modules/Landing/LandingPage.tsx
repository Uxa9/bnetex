import DynamicGrid from './components/DynamicGrid/dynamicGrid';
import styles from './LandingPage.module.scss';
import Devices from './sections/devices/devices';
import Earn from './sections/earn/earn';
import Greeting from './sections/greeting/greeting';
import Questions from './sections/questions/questions';
import Showcase from './sections/showcase/showcase';
import Trade from './sections/trade/trade';

//toDo: пофиксить overflow страницы

const LandingPage = () => {
    return (
        <main className={styles['container']}>
            <DynamicGrid />
            <div className={styles['wrapper']}>
                <Greeting />
                <Showcase />
                <Earn />
                <Trade />
                <Devices />
                <Questions />
            </div>
        </main>
    );
};

export default LandingPage;
