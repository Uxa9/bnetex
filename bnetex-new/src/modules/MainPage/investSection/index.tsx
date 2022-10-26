import { CornerArrow } from 'assets/images/icons';
import classNames from 'classnames';
import styles from './investSection.module.scss';
import { Button } from 'lib/ui-kit';
import Blur from 'components/blurredBackgroundItem';
import { useNavigate } from 'react-router-dom';
import { RoeCard, roeCards } from './roeCards';
import { AppLinksEnum } from 'routes/appLinks';
import { DynamicImg } from 'lib/utils/DynamicImg';
import { useTheme } from 'lib/hooks/useTheme';

const Invest = () => {

    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <section className={styles['invest']}>
            <Blur
                color={'blue'}
                top={'20%'}
                left={'50%'}
                type={'circle'}
            />
            <DynamicImg 
                path={`landing/invest/invest__${theme}.png`}
                className={styles['invest-image']}
            />
            <div className={styles['invest__text']}>
                <h2>Торгуйте как <span>профессионал</span></h2>
                <p
                    className={classNames('text-bold', styles['extra-text'])}
                >
                    Доверьте свои инвестиции инновационному торговому алгоритму.
                </p>

                <div className={styles['month-cards']}>
                    {
                        roeCards.map((card: RoeCard) => 
                            <div 
                                key={card.income}
                                className={classNames(
                                    styles['ROE-card'],
                                    'caption'
                                )}
                            >
                                <p className={styles['ROE-card__month']}>{card.duration}</p>
                                <div>
                                    <p className={'caption'}>ROE</p>
                                    <p className={styles['ROE-card__percent']}>от {card.income}%</p>
                                </div>
                            </div>
                        ) 
                    }
                </div>
                <Button
                    text='Начать торги'
                    Icon={CornerArrow}
                    iconAlignment={'right'}
                    buttonStyle={'outlined'}
                    onClick={() => navigate(`${AppLinksEnum.DASHBOARD}/wallet/investor`)}
                />
            </div>
        </section>
    );
};

export default Invest;
