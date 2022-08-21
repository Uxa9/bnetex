import styles from './MainPage.module.scss';
// import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import GreetingSection from './greetingSection/greetingSection';
import Earn from './earnSection';
import Invest from './investSection';
import ContactSection from './contactSection';

// const popular_crypto = ['', '', '', '', ''];

const MainPage = () => {

    return(
        <div className={styles['landing-wrapper']}>
            <div className={styles['landing-container']}>
               
                <GreetingSection />
                
                {/* <section className={styles['popular-coins']}>
                    <h3>Популярные криптовалюты</h3>
                    <div className={styles.coins}>
                        {popular_crypto.map((index) => 
                            <PopularCoin 
                                className={styles.coin}
                                key={index}
                            />
                        )
                        }
                    </div>
                </section> */}

                <Earn />

                <Invest />

                <ContactSection />
                
            </div>
        </div>
    );
};

export default MainPage;
