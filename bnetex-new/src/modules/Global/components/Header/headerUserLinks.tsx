import { Wallet, User, Logout, Login } from 'assets/images/icons';
import { useActions } from 'lib/hooks/useActionCreators';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button } from 'lib/ui-kit';
import { AppLinksEnum } from 'routes/appLinks';

interface HeaderUserLinksProps {
    closeMenu?: () => void;
    withLogoutButton?: boolean;
}

const HeaderUserLinks = ({withLogoutButton, closeMenu}: HeaderUserLinksProps) => {

    const isAuth = useTypedSelector(state => state.auth.isAuth);
    const { goToState } = useGoToState();
    const { logoutUser } = useActions();
    const { DASHBOARD, MAIN_WALLET, AUTH, LOGIN, REGISTRATION, HOME } = AppLinksEnum;

    const logout = () => {
        logoutUser();
        goToState(HOME);
    };

    return(
        isAuth ?
            <>
                <Button
                    text={'Кошельки'}
                    buttonStyle={'thin'}
                    Icon={Wallet}
                    onClick={() => {
                        goToState(`${DASHBOARD}/${MAIN_WALLET}`);
                        closeMenu && closeMenu();
                    }}
                    mini
                />
                <Button
                    text={'Профиль'}
                    buttonStyle={'thin'}
                    Icon={User}
                    onClick={() => {
                        goToState(DASHBOARD);
                        closeMenu && closeMenu();
                    }}
                    mini
                />
                {
                    withLogoutButton &&
                        <Button
                            text={'Выйти'}
                            buttonStyle={'thin'}
                            Icon={Logout}
                            onClick={() => {
                                logout();
                                closeMenu && closeMenu();
                            }}
                            mini
                        />
                }
            </>
            :
            <>
                <Button
                    text={'Войти'}
                    buttonStyle={'thin'}
                    Icon={Login}
                    onClick={() => {
                        goToState(`${AUTH}/${LOGIN}`);
                        closeMenu && closeMenu();
                    }}
                    mini
                />
                <Button
                    text={'Регистрация'}
                    onClick={() => {
                        goToState(`${AUTH}/${REGISTRATION}`);
                        closeMenu && closeMenu();
                    }}
                    mini
                />
            </>
    );
};

export default HeaderUserLinks;
