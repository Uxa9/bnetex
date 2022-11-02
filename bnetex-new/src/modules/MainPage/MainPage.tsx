import styles from './MainPage.module.scss';
import GreetingSection from './greetingSection/greetingSection';
import Earn from './earnSection';
import Invest from './investSection';
import ContactSection from './contactSection';

const MainPage = () => {
    return(
        <div className={styles['landing-wrapper']}>
            <div className={styles['landing-container']}>
                <GreetingSection />
                <Invest />
                <Earn />
                <ContactSection />
            </div>
        </div>
    );
};

export default MainPage;
