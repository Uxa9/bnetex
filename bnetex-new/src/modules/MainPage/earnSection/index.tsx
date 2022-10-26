import { CornerArrow } from 'assets/images/icons';
import classNames from 'classnames';
import styles from './earnSection.module.scss';
import {ReactComponent as EarnImg} from '../../../assets/images/landing__earn.svg';
import { Button } from 'lib/ui-kit';
import Blur from 'components/blurredBackgroundItem';

const Earn = () => {
    return(
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
                    className={classNames('text', styles['extra-text'])}
                >
                    Простой и понятный интерфейс ориентированный на активную торговлю.
                    <p>Несколько вариантов торгового интерфейса для любых задач.</p>
                </p>
                <Button 
                    text='Начать торги'
                    Icon={CornerArrow}
                    className={styles['stroke-btn']}
                    iconAlignment={'right'}
                    buttonStyle={'outlined'}
                />
            </div>
            <div
                className={styles['earn-img']}
            >
                <EarnImg
                    className={ 'svg-fill'}
                />
            </div>

        </section>
    );
};

export default Earn;
