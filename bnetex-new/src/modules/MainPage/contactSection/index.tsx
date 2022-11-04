import { Mail, Telegram } from 'assets/images/icons';
import { Button } from 'lib/ui-kit';
import styles from './contactSection.module.scss';
import {ReactComponent as AbstractGridL} from '../../../assets/images/abstract-grid--L.svg';
import {ReactComponent as AbstractGridM} from '../../../assets/images/abstract-grid--M.svg';
import Blur from 'modules/Global/components/blurredBackgroundItem';

const ContactSection = () => {

    return(
        <div className={styles.container}>
            <AbstractGridL 
                className={styles['abstract-grid--L']}
            />
            <AbstractGridM 
                className={styles['abstract-grid--M']}
            />
            <Blur 
                top='-120%'
                left='0'
                type='ellipse'
                color='green'
                rotate={160}
            />
            <section className={styles['contact-section']}>
                <div className={styles['title']}>
                    <h2>Остались <span>вопросы?</span></h2>
                    <h2>Не беспокойтесь, ответим!</h2>
                </div>
                <div className={styles.links}>
                    <p className='text'>Задайте ваши вопросы в Telegram или напишите нам на Email.</p>
                    <div className={styles.links__buttons}>
                        <Button 
                            buttonStyle={'outlined'}
                            text={'Telegram'}
                            Icon={Telegram}
                            className={styles['contact-button']}
                        />
                        <Button 
                            buttonStyle={'outlined'}
                            text={'Email'}
                            Icon={Mail}
                            className={styles['contact-button']}
                        />
                    </div>
                </div>
            </section>
        </div>

    );
};

export default ContactSection;
