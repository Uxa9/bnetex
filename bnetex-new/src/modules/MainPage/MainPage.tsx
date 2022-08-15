import Header from 'components/header';
import styles from './MainPage.module.scss';
import {ReactComponent as GraphicsImg} from '../../assets/images/landing__graphics.svg';
import { Button, Input } from 'lib/ui-kit';
import classNames from 'classnames';
import {ReactComponent as MainBG} from '../../assets/images/landing__bg.svg';
import {ReactComponent as PopularCoin} from '../../assets/images/landing__popular-coins.svg';
import {ReactComponent as Earn} from '../../assets/images/landing__earn.svg';
import {ReactComponent as AngledArrow} from '../../assets/images/icons/angled_arrow.svg';
import {ReactComponent as StartEarningBG} from '../../assets/images/landing__startEarningBg.svg';
// import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';

const popular_crypto = ['', '', '', '', ''];

const MainPage = () => {

    return(
        <div className={styles.page}>
            <Header 
                mode='beginner'
            />

            <div className={styles['landing-wrapper']}>
                <div className={styles['landing-container']}>
                    <MainBG 
                        className={styles['main-bg']}
                    />
                    <section className={styles['greeting-block']}>
                        <div className={styles['greeting-text']}>
                            <h1>Инновационный статистический <span>алгоритм</span></h1>
                            <p 
                                className={classNames('body-1', styles['extra-text'])}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. 
                                Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur,
                                 ultrices mauris. Maecenas vitae mattis tellus. 
                            </p>
                            <div className={styles['greeting-text__input-block']}>
                                <Input 
                                    label='Email'
                                    hasBackground
                                    type={'email'}
                                />
                                <Button className={styles['button']}>
                                    <p className='body-1'>Регистрация</p>
                                </Button>
                            </div>
                        </div>
                        <GraphicsImg />
                    </section>

                    <section className={styles['popular-coins']}>
                        <h3>Популярные криптовалюты</h3>
                        {/* <Swiper
                            slidesPerView={'auto'}
                            spaceBetween={20}
                        >
                            {popular_crypto.map((index) => 
                                <SwiperSlide>
                                    <PopularCoin 
                                        className={styles.coin}
                                        key={index}
                                    />
                                </SwiperSlide>
                            )
                            }
                        </Swiper> */}

                        <div className={styles.coins}>
                            {popular_crypto.map((index) => 
                                <PopularCoin 
                                    className={styles.coin}
                                    key={index}
                                />
                            )
                            }
                        </div>
                           
                    </section>

                    <section className={styles['start-earning']}>
                        <StartEarningBG 
                            className={styles['start-earning__bg']}
                        />
                        <div className={styles['start-earning__text']}>
                            <h2>Начните <span>зарабатывать</span> на рынке криптовалют</h2>
                            <p 
                                className={classNames('body-1', styles['extra-text'])}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                                Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,  
                                mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. 
                            </p>
                            <button
                                className={styles['stroke-btn']}
                            >
                                <p className='button-text'>Начать торги</p>
                                <AngledArrow 
                                    width={'24px'}
                                    height={'24px'}
                                />
                            </button>
                        </div>
                        <Earn
                            className={styles['earn-img']}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
