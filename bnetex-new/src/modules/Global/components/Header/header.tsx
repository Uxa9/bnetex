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
import classNames from 'classnames';
import variablesMap from 'styles/exportedVariables.module.scss';
import { useToast } from 'lib/hooks/useToast';

const mobileMediaQuery = window.matchMedia(`(min-width: ${Number(variablesMap.earlyMobileBp) + 1}px)`);

const Header = () => {
    const { HOME, TERMINAL } = AppLinksEnum;
    const { goToState } = useGoToState();
    const { theme, toggleTheme } = useTheme();

    const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
    const toggleIsMenuOpenedMenu = () =>  setIsMenuOpened(prevState => !prevState);

    const closeMenuOnResize = (isMatched: boolean) => {
        isMatched && setIsMenuOpened(false);
    };

    const { bakeToast } = useToast();

    useEffect(() => {
        mobileMediaQuery
            .addEventListener('change', 
                (event: MediaQueryListEvent) => closeMenuOnResize(event.matches)
            );
    }, []);

    return (
        <>
            <header
                className={classNames(
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
                            onClick={() => goToState(`${TERMINAL}/investor`)}
                            mini
                        />
                        <Button
                            className={styles['trading-link']}
                            text={'Испечь тост'}
                            buttonStyle={'thin'}
                            onClick={() => bakeToast.success('Млем млем млем')}
                            mini
                        />
                    </div>
                    <div className={styles['links__user']}>
                        <HeaderUserLinks 
                            withLogoutButton
                        />
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
                        onClick={toggleIsMenuOpenedMenu}
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
