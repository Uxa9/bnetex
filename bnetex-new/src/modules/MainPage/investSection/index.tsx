import { CornerArrow } from 'assets/images/icons';
import classNames from 'classnames';
import styles from './investSection.module.scss';
import { ReactComponent as InvestImg } from '../../../assets/images/landing__invest.svg';
import { Button } from 'lib/ui-kit';
import Blur from 'components/blurredBackgroundItem';
import { useNavigate } from 'react-router-dom';

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

            <InvestImg
                className='svg-fill'
            />

            <div className={styles['invest__text']}>
                <h2>Торгуйте как <span>профессионал</span></h2>
                <p
                    className={classNames('body-1', styles['extra-text'])}
                >
                    Доверьте свои инвестиции инновационному торговому алгоритму.
                </p>

                <div className={styles['month-cards']}>
                    <div className={styles['ROE-card']}>
                        <p className={styles['ROE-card__month']}>1 месяц</p>
                        <div>
                            <p className='label-1'>ROE</p>
                            <p className={styles['ROE-card__percent']}>25</p>
                        </div>
                    </div>
                    <div className={styles['ROE-card']}>
                        <p className={styles['ROE-card__month']}>3 месяца</p>
                        <div>
                            <p className='label-1'>ROE</p>
                            <p className={styles['ROE-card__percent']}>45</p>
                        </div>
                    </div>
                    <div className={styles['ROE-card']}>
                        <p className={styles['ROE-card__month']}>6 месяцев</p>
                        <div>
                            <p className='label-1'>ROE</p>
                            <p className={styles['ROE-card__percent']}>65</p>
                        </div>
                    </div>
                    <div className={styles['ROE-card']}>
                        <p className={styles['ROE-card__month']}>12 месяцев</p>
                        <div>
                            <p className='label-1'>ROE</p>
                            <p className={styles['ROE-card__percent']}>125</p>
                        </div>
                    </div>
                </div>

                <Button
                    text='Начать торги'
                    Icon={CornerArrow}
                    className={styles['stroke-btn']}
                    iconAlignment={'right'}
                    buttonStyle={'outlined'}
                    onClick={() => navigate('/terminal/investor')}
                />
            </div>
        </section>
    );
};

export default Invest;
