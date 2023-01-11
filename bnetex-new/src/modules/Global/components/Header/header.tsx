import styles from './header.module.scss';
import { Logo, Brightness, Moon } from 'assets/images/icons';
import { Button } from 'lib/ui-kit';
import { AppLinksEnum } from 'routes/appLinks';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useTheme } from 'lib/hooks/useTheme';
import Burger from './Burger/burger';
import { useEffect, useState } from 'react';
import HeaderUserLinks from './headerUserLinks';
import BurgerMenu from './BurgerMenu/burgerMenu';
import clsx from 'clsx';
import getCssVariable from 'lib/utils/getCssVariable';
import SettingsMenu from './SettingsMenu';

const mobileMediaQuery = window.matchMedia(`(min-width: ${getCssVariable('MOBILE_BP') + 1}px)`);

const Header = () => {
    const { HOME, TERMINAL } = AppLinksEnum;
    const { goToState } = useGoToState();
    const { theme, toggleTheme } = useTheme();

    const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
    const toggleIsMenuOpened = () =>  setIsMenuOpened(prevState => !prevState);

    const closeMenuOnResize = (isMatched: boolean) => {
        isMatched && setIsMenuOpened(false);
    };

    useEffect(() => {
        mobileMediaQuery
            .addEventListener('change',
                (event: MediaQueryListEvent) => closeMenuOnResize(event.matches)
            );
    }, []);

    return (
        <>
            <header
                className={clsx(
                    styles.header,
                    isMenuOpened && styles['header--menu-opened']
                )}
            >
                <nav className={styles.links}>
                    <div className={styles['links__main']}>
                        <Logo
                            className={styles.logo}
                            onClick={() => {
                                setIsMenuOpened(false);
                                goToState(HOME);
                            }}
                        />
                        <Button
                            className={styles['trading-link']}
                            text={'Алготрейдинг'}
                            buttonStyle={'thin'}
                            onClick={() => {
                                setIsMenuOpened(false);
                                goToState(`${TERMINAL}/investor`);
                            }}
                            mini
                        />
                    </div>
                    <div className={styles['links__user']}>
                        <HeaderUserLinks
                            withLogoutButton
                        />
                        {/* <SettingsMenu /> */}
                        <Button
                            buttonStyle={'thin'}
                            Icon={theme === 'dark' ? Moon : Brightness}
                            onClick={toggleTheme}
                        />
                    </div>
                </nav>
                <div
                    className={styles['header__burger']}
                >
                    <Burger
                        isOpened={isMenuOpened}
                        onClick={toggleIsMenuOpened}
                    />
                </div>
            </header>
            <BurgerMenu
                isOpened={isMenuOpened}
                onClose={() => setIsMenuOpened(false)}
            />
        </>
    );
};

export default Header;
