import styles from './header.module.scss';
import { Wallet, User, Logo, Login, Logout, Brightness, Moon } from '../../assets/images/icons';
import { Button } from 'lib/ui-kit';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
// import SettingsMenu from './SettingsMenu';
// import { useState } from 'react';
import { AppLinksEnum } from 'routes/appLinks';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useActions } from 'lib/hooks/useActionCreators';
import { useTheme } from 'lib/hooks/useTheme';

const Header = () => {
    const { AUTH, REGISTRATION, LOGIN } = AppLinksEnum;
    const { goToState } = useGoToState();
    const { logoutUser } = useActions();    
    const isAuth = useTypedSelector(state => state.auth.isAuth);
    const { theme, toggleTheme } = useTheme();

    // const [isSettingsOpened, setIsSettingsOpened] = useState<boolean>(false);
    // const toggleSettingsMenu = () => setIsSettingsOpened(prevState => !prevState);

    // const isTerminalOpened = useTypedSelector(state => state.terminal.isOpen);

    return (
        <header
            className={styles.header}
        >
            <Logo
                className={styles.logo}
                onClick={() => goToState('/')}
            />
            <nav className={styles.links}>
                <div className={styles['links__main']}>
                    <Button
                        text={'Алготрейдинг'}
                        buttonStyle={'thin'}
                        className={styles.header__btn}
                        onClick={() => goToState('/terminal/investor')}
                    />
                </div>
                <div className={styles['links__user']}>
                    {
                        isAuth ?
                            <>
                                <Button
                                    text={'Кошельки'}
                                    buttonStyle={'thin'}
                                    Icon={Wallet}
                                    className={styles.header__btn}
                                    onClick={() => goToState('/dashboard/wallet/main')}
                                />
                                <Button
                                    text={'Профиль'}
                                    buttonStyle={'thin'}
                                    Icon={User}
                                    className={styles.header__btn}
                                    onClick={() => goToState('/dashboard')}
                                />
                                <Button
                                    text={'Выйти'}
                                    buttonStyle={'thin'}
                                    Icon={Logout}
                                    className={styles.header__btn}
                                    onClick={logoutUser}
                                />
                            </>
                            :
                            <>
                                <Button
                                    text={'Войти'}
                                    buttonStyle={'thin'}
                                    Icon={Login}
                                    className={styles.header__btn}
                                    onClick={() => goToState(`${AUTH}/${LOGIN}`)}
                                />
                                <Button
                                    text={'Регистрация'}
                                    onClick={() => goToState(`${AUTH}/${REGISTRATION}`)}
                                />
                            </>
                    }

                    <Button
                        buttonStyle={'thin'}
                        Icon={theme === 'dark' ? Moon : Brightness}
                        onClick={toggleTheme}
                    />

                    {/* {
                        isTerminalOpened &&

                            <Button
                                buttonStyle={'thin'}
                                Icon={Settings}
                                onClick={toggleSettingsMenu}
                            />
                    } */}
                   
                </div>
            </nav>
            {/* {
                isTerminalOpened && isSettingsOpened &&
                    <SettingsMenu />
            } */}
        </header>
    );
};

export default Header;
