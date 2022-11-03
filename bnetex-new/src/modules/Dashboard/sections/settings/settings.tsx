import styles from './settings.module.scss';
import classNames from 'classnames';
import SettingItem, { SettingItemProps } from '../../components/SettingItem/settingItem';
import { Button } from 'lib/ui-kit';
import { Key } from 'assets/images/icons';

// const SettingItems: SettingItemProps[] = [
//     {
//         title: 'Подтверждение по email',
//         activeStateText: 'dmit****@mail.ru',
//         hasActiveState: true,
//         editable: true,
//     },
//     {
//         title: 'Пароль для входа',
//         activeStateText: '',
//         editable: true,
//     },
// ];

const Settings = () => {

    return(
        <div className={styles.settings}>
            <h3>Настройки</h3>
            {/* <div className={classNames(styles['settings-card'], 'card')}>
                <h4>Безопасность</h4>

                <div className={styles['setting-items']}>
                    {
                        SettingItems.map((item: SettingItemProps, index: number) => 
                            <SettingItem 
                                key={index}
                                title={item.title}
                                activeStateText={item.activeStateText}
                                editable={item.editable}
                                hasActiveState={item.hasActiveState}
                            />
                        )
                    }
                </div>
            </div> */}

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
