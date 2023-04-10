import styles from './settings.module.scss';
import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import { Key } from 'assets/images/icons';
import { useModal } from 'lib/hooks/useModal';
import ChangePasswordModal from './modals/changePasswordModal';
import { useTheme } from 'lib/hooks/useTheme';
import ChangeApiKey from './modals/chageAPIKeys';

const Settings = () => {
    const { open: openChangePasswordModal } = useModal(ChangePasswordModal);
    const { open: openAPIChangeModal } = useModal(ChangeApiKey);
    const { theme } = useTheme();

    return (
        <div className={styles['settings']}>
            <h3>Настройки</h3>
            <div
                className={clsx(styles['setting-card'], 'card')}
            >
                <p
                    className={clsx(styles['card-label'], 'caption')}
                >
                    Безопасность
                </p>
                <div className={styles['setting-item']}>
                    <div className={styles['setting-item__title']}>
                        <div
                            className={clsx(
                                styles['setting-item__icon-wrapper'],
                                theme === 'dark' && styles['setting-item__icon-wrapper--dark']
                            )}
                        >
                            <Key />
                        </div>
                        <span className={'text'}>Пароль</span>
                    </div>
                    <Button
                        buttonStyle={'flat'}
                        text={'Изменить'}
                        onClick={openChangePasswordModal}
                    />
                </div>
            </div>
            
            <div
                className={clsx(styles['setting-card'], 'card')}
            >
                <p
                    className={clsx(styles['card-label'], 'caption')}
                >
                    Трейдинг
                </p>
                <div className={styles['setting-item']}>
                    <div className={styles['setting-item__title']}>
                        <div
                            className={clsx(
                                styles['setting-item__icon-wrapper'],
                                theme === 'dark' && styles['setting-item__icon-wrapper--dark']
                            )}
                        >
                            <Key />
                        </div>
                        <span className={'text'}>API ключ</span>
                    </div>
                    <Button
                        buttonStyle={'flat'}
                        text={'Изменить'}
                        onClick={openAPIChangeModal}
                    />
                </div>
            </div>
        </div>
    );
};

export default Settings;
