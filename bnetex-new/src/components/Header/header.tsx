import styles from './header.module.scss';

import { Wallet, User, Logo, Settings, Login } from '../../assets/images/icons';

import _l from '../../locales/index';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'lib/ui-kit';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { useActions } from 'lib/hooks/useActionCreators';
import SettingsMenu from './SettingsMenu';
import { useState } from 'react';

const Header = () => {

    const navigate = useNavigate();

    const [isSettingsOpened, setIsSettingsOpened] = useState<boolean>(false);

    const toggleSettingsMenu = () => setIsSettingsOpened(prevState => !prevState);

    const isAuth = useTypedSelector(state => state.auth.isAuth);
    const isTerminalOpened = useTypedSelector(state => state.terminal.isOpen);
    const { login } = useActions();

    const testOnClick = () => {
        login();
    };

    return (
        <header
            className={styles.header}
        >
            <Logo
                className={styles.logo}
                onClick={() => navigate('/')}
            />
            <nav className={styles.links}>
                <div className={styles['links__main']}>
                    <Link to={'terminal/investor'}>
                        <Button
                            text={'Фьючерсы USD-M'}
                            buttonStyle={'thin'}
                        />
                    </Link>

                    <Button
                        text={'P2P'}
                        buttonStyle={'thin'}
                    />

                </div>
                <div className={styles['links__user']}>
                    {
                        isAuth ?
                            <>
                                <Link to={'dashboard/wallet/main'}>
                                    <Button
                                        text={'Кошельки'}
                                        buttonStyle={'thin'}
                                        Icon={Wallet}
                                    />
                                </Link>
                                <Link to={'dashboard'}>
                                    <Button
                                        text={'Профиль'}
                                        buttonStyle={'thin'}
                                        Icon={User}
                                    />
                                </Link>
                            </>
                            :
                            <>
                                <Button
                                    text={'Войти'}
                                    buttonStyle={'thin'}
                                    Icon={Login}
                                    onClick={() => testOnClick()}
                                />
                                <Link
                                    to={'signup'}
                                >
                                    <Button
                                        text={'Регистрация'}
                                    />
                                </Link>
                            </>
                    }

                    {
                        isTerminalOpened &&

                            <Button
                                buttonStyle={'thin'}
                                Icon={Settings}
                                onClick={toggleSettingsMenu}
                            />
                    }
                   
                </div>
            </nav>
            {
                isTerminalOpened && isSettingsOpened &&
                    <SettingsMenu />
            }
        </header>
    );
};

export default Header;
