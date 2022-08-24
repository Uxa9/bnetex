import styles from './header.module.scss';

import { Wallet, User, Logo, Settings, Login } from '../../assets/images/icons';

import _l from '../../locales/index';
import { useNavigate } from 'react-router-dom';
import { Button } from 'lib/ui-kit';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { useActions } from 'lib/hooks/useActionCreators';

const Header = () => {

    const navigate = useNavigate();

    const isAuth = useTypedSelector(state => state.auth.isAuth);
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
                    <Button
                        text={'Фьючерсы USD-M'}
                        buttonStyle={'thin'}
                    />
                    <Button
                        text={'P2P'}
                        buttonStyle={'thin'}
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
                                />
                                <Button
                                    text={'Профиль'}
                                    buttonStyle={'thin'}
                                    Icon={User}
                                />
                            </>
                            :
                            <>
                                <Button
                                    text={'Войти'}
                                    buttonStyle={'thin'}
                                    Icon={Login}
                                    onClick={() => testOnClick()}
                                />
                                <Button
                                    text={'Регистрация'}
                                />
                            </>
                    }
                    <Button
                        buttonStyle={'thin'}
                        Icon={Settings}
                    />
                </div>
            </nav>

        </header>
    );
};

export default Header;