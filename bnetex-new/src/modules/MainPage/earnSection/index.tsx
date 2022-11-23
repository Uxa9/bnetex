import { CornerArrow } from 'assets/images/icons';
import clsx from 'clsx';
import styles from './earnSection.module.scss';
import { Button } from 'lib/ui-kit';
import { DynamicImg } from 'lib/utils/DynamicImg';
import SignedNumber from 'modules/Global/components/signedNumber/signedNumber';
import { useTheme } from 'lib/hooks/useTheme';
import { AppLinksEnum } from 'routes/appLinks';
import { useGoToState } from 'lib/hooks/useGoToState';
import Blur from 'modules/Global/components/blurredBackgroundItem';

const Earn = () => {
    
    const { DASHBOARD, INVESTOR_WALLET } = AppLinksEnum;
    const { goToState } = useGoToState();
    const { theme } = useTheme();
    
    return (
        <section className={styles['start-earning']}>
            <Blur 
                color={'purple'}
                top={'0'}
                left={'0'} 
                type={'ellipse'}
                rotate={-165}
            />
            <Blur 
                color={'blue'}
                top={'-10%'}
                left={'30%'} 
                type={'ellipse'}
            />
            <Blur 
                color={'green'}
                top={'-30%'}
                left={'-10%'} 
                type={'circle'}
            />
            <div className={styles['start-earning__text']}>
                <h2>Начните <span>зарабатывать</span> на рынке криптовалют</h2>
                <p 
                    className={clsx('text', styles['extra-text'])}
                >
                    Простой и понятный интерфейс ориентированный на активную торговлю.
                </p>
                <Button 
                    text='Начать торги'
                    Icon={CornerArrow}
                    iconAlignment={'right'}
                    buttonStyle={'outlined'}
                    onClick={() =>  goToState(`${DASHBOARD}/${INVESTOR_WALLET}`)}
                />
            </div>
            <div
                className={clsx(
                    styles['start-earning__image'],
                    styles[`start-earning__image--${theme}`]
                )}
            >
                <div className={styles['header']}>
                    <div className={styles['header__coin']}>
                        <DynamicImg 
                            path={'logo_BTC.png'}
                        />
                        <div className={styles['header__column']}>
                            <span className={'subtitle'}>BTC</span>
                            <span className={clsx(styles['header__text--gray'], 'caption')}>Bitcoin</span>
                        </div>
                    </div>
                    <div className={styles['header__data']}>
                        <div className={styles['header__column']}>
                            <span className={clsx(styles['header__text--gray'], 'caption')}>Цена (USDT)</span>
                            <span className={'text'}>23458.02</span>
                        </div>
                        <div className={styles['header__column']}>
                            <span className={clsx(styles['header__text--gray'], 'caption')}>YTD</span>
                            <SignedNumber 
                                value={52.44}
                                postfix={'USDT'}
                            />
                        </div>
                        <div className={styles['header__column']}>
                            <span className={clsx(styles['header__text--gray'], 'caption')}>24 ч.</span>
                            <SignedNumber 
                                value={1.37}
                                postfix={'USDT'}
                            />
                        </div>
                    </div>
                </div>
                <DynamicImg 
                    path={`landing/earn/earn__${theme}.svg`}
                    className={styles['candles']}
                />
                <div className={styles['buttons']}>
                    <Button 
                        buttonStyle={'primary'}
                        buttonTheme={'green'}
                        text={'Купить/Лонг'}
                        fillContainer
                        className={styles['button-green']}
                    />
                    <Button 
                        buttonStyle={'primary'}
                        buttonTheme={'red'}
                        text={'Продать/Шорт'}
                        fillContainer
                        className={styles['button-red']}
                    />
                </div>
            </div>
        </section>
    );
};

export default Earn;
