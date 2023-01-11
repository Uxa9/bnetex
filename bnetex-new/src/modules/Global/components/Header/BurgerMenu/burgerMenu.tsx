import clsx from 'clsx';
import { useTheme } from 'lib/hooks/useTheme';
import { Button, Switch } from 'lib/ui-kit';
import { useEffect, useState } from 'react';
import styles from './burgerMenu.module.scss';
import HeaderUserLinks from '../headerUserLinks';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Logout } from 'assets/images/icons';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useActions } from 'lib/hooks/useActionCreators';
import { AppLinksEnum } from 'routes/appLinks';
import getCssVariable from 'lib/utils/getCssVariable';

interface BurgerMenuProps {
    isOpened: boolean;
    onClose: () => void;
}

const DEFAULT_TRANSITION = getCssVariable('DEFAULT_TRANSITION');

export default function BurgerMenu({isOpened, onClose}: BurgerMenuProps) {

    const { theme, toggleTheme } = useTheme();
    const [ isOverlayVisible, setIsOverlayVisible ] = useState<boolean>(false);
    const isAuth = useTypedSelector(state => state.auth.isAuth);
    const { goToState } = useGoToState();
    const { logoutUser } = useActions();
    const { HOME } = AppLinksEnum;

    useEffect(() => {
        // Таймаут вызывает сокрытие overlay через visibility: hidden только после завершения
        // анимации снижения прозрачности overlay до нуля.
        isOpened ?
            setIsOverlayVisible(true) :
            setTimeout(() => setIsOverlayVisible(false), DEFAULT_TRANSITION);
    }, [ isOpened ]);

    const logout = () => {
        logoutUser();
        goToState(HOME);
    };

    return (
        <>
            <div
                className={clsx(
                    styles['overlay'],
                    isOpened && styles['overlay--visible']
                )}
                onClick={onClose}
                style={{visibility: isOverlayVisible ? 'visible' : 'hidden'}}
            />
            <aside
                className={clsx(
                    styles['burger-menu'],
                    isOpened && styles['burger-menu--opened']
                )}
            >
                <div className={styles['burger-menu__main']}>
                    <HeaderUserLinks
                        closeMenu={onClose}
                    />
                    <Button
                        className={styles['trading-link']}
                        text={'Алготрейдинг'}
                        buttonStyle={'thin'}
                        onClick={() => {
                            goToState(`${AppLinksEnum.TERMINAL}/investor`);
                            onClose();
                        }}
                        mini
                    />
                </div>
                <div className={styles['burger-menu__secondary']}>
                    {
                        isAuth &&
                            <Button
                                text={'Выйти'}
                                buttonStyle={'thin'}
                                Icon={Logout}
                                onClick={logout}
                                mini
                            />
                    }
                    <Switch
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                        label={'Темная тема'}
                    />
                </div>
            </aside>
        </>
    );
}
