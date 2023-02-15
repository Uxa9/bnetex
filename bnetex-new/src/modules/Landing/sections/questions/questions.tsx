import { Mail, Telegram } from 'assets/images/icons';
import { Button } from 'lib/ui-kit';
import styles from './questions.module.scss';


const Questions = () => {
    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                <h2>Остались вопросы?</h2>
                <div className={styles['main']}>
                    <p className={'text'}>
                        Свяжитесь с нами по Email или через Telegram и задайте любые интересующие вас вопросы
                    </p>
                    <div className={styles['actions']}>
                        <Button
                            buttonStyle={'secondary'}
                            Icon={Telegram}
                            text={'Telegram'}
                            onClick={() => window.open('https://t.me/bnetex')}
                        />
                        <a href={'mailto:info@bnetex.com'}>
                            <Button
                                buttonStyle={'secondary'}
                                Icon={Mail}
                                text={'Email'}
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Questions;
