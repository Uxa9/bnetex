import { Play } from 'assets/images/icons';
import { useGoToState } from 'lib/hooks/useGoToState';
import { Button } from 'lib/ui-kit';
import { AppLinksEnum } from 'routes/appLinks';
import styles from './greeting.module.scss';

const Greeting = () => {

    const { goToState } = useGoToState();

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                <h1>
                    <span>математическое</span>
                    <span>моделирование</span>
                    <span>рынка криптовалют</span>
                </h1>
                <div className={styles['actions']}>
                    <Button
                        buttonStyle={'primary'}
                        text={'Создать аккаунт'}
                        onClick={() => goToState(`${AppLinksEnum.AUTH}/${AppLinksEnum.REGISTRATION}`)}
                    />
                    <Button
                        buttonStyle={'thin'}
                        text={'История достижений'}
                        Icon={Play}
                        // toDo: сразу открывать вкладку история
                        onClick={() => goToState(`${AppLinksEnum.TERMINAL}/investor`)}
                    />
                </div>
            </div>
        </section>
    );
};

export default Greeting;
