import styles from './header.module.scss';
import { Wallet, User, Logo, Login, Logout, Brightness, Moon } from '../../assets/images/icons';
import { Button } from 'lib/ui-kit';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { AppLinksEnum } from 'routes/appLinks';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useActions } from 'lib/hooks/useActionCreators';
import { useTheme } from 'lib/hooks/useTheme';
import Burger from './Burger/burger';
import { useState } from 'react';
import BurgerMenu from './Burger/burgerMenu';

const Header = () => {
    const { AUTH, REGISTRATION, LOGIN } = AppLinksEnum;
    const { goToState } = useGoToState();
    const { logoutUser } = useActions();
    const isAuth = useTypedSelector(state => state.auth.isAuth);
    const { theme, toggleTheme } = useTheme();

    const [activeBurger, setActiveBurger] = useState(false);

    const renderLinks = () => {
        return isAuth ? [
            <Button
                text={'Кошельки'}
                buttonStyle={'thin'}
                Icon={Wallet}
                className={styles.header__btn}
                onClick={() => goToState('/dashboard/wallet/main')}
                mini
            />,
            <Button
                text={'Профиль'}
                buttonStyle={'thin'}
                Icon={User}
                className={styles.header__btn}
                onClick={() => goToState('/dashboard')}
                mini
            />,
            <div
                className={styles.exit__btn}
            >
                <Button
                    text={'Выйти'}
                    buttonStyle={'thin'}
                    Icon={Logout}
                    className={styles.header__btn}
                    onClick={logoutUser}
                    mini
                />
            </div>
        ] : [
            <Button
                text={'Войти'}
                buttonStyle={'thin'}
                Icon={Login}
                className={styles.header__btn}
                onClick={() => goToState(`${AUTH}/${LOGIN}`)}
                mini
            />,
            <div
                className={styles.wide__btn}
            >
                <Button
                    text={'Регистрация'}
                    onClick={() => goToState(`${AUTH}/${REGISTRATION}`)}
                    mini
                />
            </div>
        ]
    };

    return (
        <header
            className={styles.header}
        >
            <Logo
                className={styles.logo}
                onClick={() => {
                    setActiveBurger(false);
                    goToState('/');
                }}
            />
            <nav className={styles.links}>
                <div className={styles['links__main']}>
                    <Button
                        text={'Алготрейдинг'}
                        buttonStyle={'thin'}
                        className={styles.header__btn}
                        onClick={() => goToState('/terminal/investor')}
                        mini
                    />
                </div>
                <div className={styles['links__user']}>
                    {renderLinks().map(item => {
                        return item;
                    })}
                    <Button
                        buttonStyle={'thin'}
                        Icon={theme === 'dark' ? Moon : Brightness}
                        onClick={toggleTheme}
                    />
                </div>
                <div
                    className={styles['burger-button-wrapper']}
                    onClick={() => setActiveBurger(!activeBurger)}
                >
                    <Burger
                        active={activeBurger}
                    />
                </div>
            </nav>
            <div
                className={styles['burger-menu-container']}
            >
                <BurgerMenu
                    open={activeBurger}
                    onClose={() => setActiveBurger(false)}
                    links={renderLinks}
                    auth={isAuth}
                />
            </div>
        </header>
    );
};

export default Header;
