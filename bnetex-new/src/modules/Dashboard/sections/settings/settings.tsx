import styles from './settings.module.scss';
import classNames from 'classnames';
import { Button } from 'lib/ui-kit';
import { Key } from 'assets/images/icons';

const Settings = () => {

    return(
        <div className={styles.settings}>
            <h3>Настройки</h3>
            <div
                className={classNames(styles['setting-card'], 'card')}
            >
                <Key />
                <div
                    className={styles['card-content']}
                >
                    <div>Пароль</div>
                    <Button
                        buttonStyle='primary'
                        text='Изменить'
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
