import clsx from 'clsx';
import Blur from 'modules/Global/components/blurredBackgroundItem';
import EarnCard from 'modules/Landing/components/earnCard/earnCard';
import { earnCards } from './cards';
import styles from './earn.module.scss';

const Earn = () => {
    return (
        <section className={styles['container']}>
            <Blur
                type={'ellipse'}
                color={'blue'}
                top={'20%'}
                left={'30%'}
                rotate={40}
            />
            <Blur
                type={'circle'}
                color={'purple'}
                top={'20%'}
                left={'0%'}
                rotate={40}
            />
            <div className={styles['wrapper']}>
                <h2>Начните <span>зарабатывать</span></h2>
                <div className={styles['slider']}>
                    {
                        earnCards.map(card =>
                            <EarnCard
                                key={card.percent}
                                className={clsx(card.isPrimary && styles['primary-card'])}
                                {...card}
                            />)
                    }
                </div>
            </div>
        </section>
    );
};

export default Earn;
