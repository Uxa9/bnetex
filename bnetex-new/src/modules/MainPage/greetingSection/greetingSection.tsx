import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import styles from './greetingSection.module.scss';
import { ReactComponent as GraphicLine } from '../../../assets/images/landing/graphic__line.svg';
import { ReactComponent as GraphicGradient } from '../../../assets/images/landing/graphic__gradient.svg';
import { DynamicImg } from 'lib/utils/DynamicImg';
import { AppLinksEnum } from 'routes/appLinks';
import { useGoToState } from 'lib/hooks/useGoToState';
import Blur from 'modules/Global/components/blurredBackgroundItem';
import { useCurrentPlatform } from 'lib/hooks/usePlatform';

const GreetingSection = () => {

    const { DASHBOARD, INVESTOR_WALLET } = AppLinksEnum;
    const { goToState } = useGoToState();
    const { isCurrentPlatformMobile } = useCurrentPlatform();

    return(
        <section className={styles['greeting-block']}>
            <Blur
                color={'purple'}
                top={isCurrentPlatformMobile ? '5%' : '-10%'}
                left={'-10%'}
                type={'ellipse'}
                rotate={165}
            />
            <Blur
                color={'blue'}
                top={isCurrentPlatformMobile ? '15%' : '-20%'}
                left={'45%'}
                type={'circle'}
            />
            <Blur
                color={'green'}
                top={'30%'}
                left={'50%'}
                type={'circle'}
            />
            <div className={styles['greeting-text']}>
                <h1>Инновационный статистический <span>алгоритм</span></h1>
                <p
                    className={clsx('text-bold', styles['extra-text'])}
                >
                    Интерактивный сигнальный индикатор выведет вашу торговлю на совершенно новый уровень.
                    Торгуйте как профессионал. Это просто.
                </p>
                <Button
                    text={'Начать работу'}
                    buttonStyle={'outlined'}
                    onClick={() =>  goToState(`${DASHBOARD}/${INVESTOR_WALLET}`)}
                />
            </div>
            <div
                className={styles['greeting-img']}
            >
                <div className={clsx(styles['greeting-card'], styles['token-card'])}>
                    <div className={styles['token']}>
                        <DynamicImg
                            path={'logo_BTC.png'}
                        />
                        <div className={styles['token__skeletons']}>
                            <div className={styles['skeleton-row']}>
                                <div className={styles['skeleton']} />
                                <div className={styles['skeleton']} />
                            </div>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} />
                        </div>
                    </div>
                    <div className={styles['graphic']}>
                        <GraphicLine className={styles['graphic__line']} />
                        <GraphicGradient className={styles['graphic__gradient']} />
                    </div>
                </div>
                <div className={clsx(styles['greeting-card'], styles['data-card'])}>
                    <div className={styles['data-item']}>
                        <div className={styles['skeleton']} style={{width: '30%'}} />
                        <div className={styles['skeleton-progress']}>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} style={{width: '45%'}} />
                        </div>
                    </div>
                    <div className={styles['data-item']}>
                        <div className={styles['skeleton']} style={{width: '40%'}} />
                        <div className={styles['skeleton-progress']}>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} style={{width: '25%'}} />
                        </div>
                    </div>
                    <div className={styles['data-item']}>
                        <div className={styles['skeleton']} style={{width: '65%'}} />
                        <div className={styles['skeleton-progress']}>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} style={{width: '35%'}} />
                        </div>
                    </div>
                    <div className={styles['data-item']}>
                        <div className={styles['skeleton']} style={{width: '17%'}} />
                        <div className={styles['skeleton-progress']}>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} style={{width: '42%'}} />
                        </div>
                    </div>
                    <div className={styles['data-item']}>
                        <div className={styles['skeleton']} style={{width: '80%'}} />
                        <div className={styles['skeleton-progress']}>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} style={{width: '65%'}} />
                        </div>
                    </div>
                    <div className={styles['data-item']}>
                        <div className={styles['skeleton']} style={{width: '45%'}} />
                        <div className={styles['skeleton-progress']}>
                            <div className={styles['skeleton']} />
                            <div className={styles['skeleton']} style={{width: '75%'}} />
                        </div>
                    </div>
                </div>
                <div className={clsx(styles['greeting-card'], styles['pie-chart-card'])}>
                    <div className={clsx(styles['sector'], styles['sector--blue'])} />
                    <div className={clsx(styles['sector'], styles['sector--purple'])} />
                    <div className={clsx(styles['sector'], styles['sector--orange'])} />
                    <div className={clsx(styles['sector'], styles['sector--red'])} />
                    <div className={clsx(styles['sector'], styles['sector--hide'])} />
                </div>
            </div>
        </section>
    );
};

export default GreetingSection;
