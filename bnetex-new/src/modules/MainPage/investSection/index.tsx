import { CornerArrow } from 'assets/images/icons';
import classNames from 'classnames';
import styles from './investSection.module.scss';
import { ReactComponent as GraphicGrid } from '../../../assets/images/landing/invest/graphic__grid.svg';
import { ReactComponent as GraphicGradient } from '../../../assets/images/landing/invest/graphic__gradient.svg';
import { ReactComponent as GraphicLine } from '../../../assets/images/landing/invest/graphic__line.svg';
import { Button } from 'lib/ui-kit';
import Blur from 'components/blurredBackgroundItem';
import { useNavigate } from 'react-router-dom';
import { RoeCard, roeCards } from './roeCards';
import { AppLinksEnum } from 'routes/appLinks';

const Invest = () => {

    const navigate = useNavigate();

    return (
        <section className={styles['invest']}>
            <Blur
                color={'blue'}
                top={'20%'}
                left={'50%'}
                type={'circle'}
            />
            <div className={styles['invest__image']}>
                <GraphicGrid 
                    className={styles['grid']}
                />
                <GraphicGradient
                    className={styles['gradient']}
                />
                <GraphicLine 
                    className={styles['line']}
                />
            </div>
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
