import styles from './settings.module.scss';
import classNames from 'classnames';


const Settings = () => {

    return(
        <div className={classNames('card', styles.settings)}>
                Настройки
        </div>
    );
};

export default Settings;
