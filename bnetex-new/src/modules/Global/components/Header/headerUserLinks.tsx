import { Wallet, User, Logout, Login } from 'assets/images/icons';
import { useGoToState } from 'lib/hooks/useGoToState';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button } from 'lib/ui-kit';
import { AppLinksEnum } from 'routes/appLinks';
import { logoutUser } from 'store/action-creators/auth';

const HeaderUserLinks = ({withLogoutButton}: {withLogoutButton?: boolean}) => {

    const isAuth = useTypedSelector(state => state.auth.isAuth);
    const { goToState } = useGoToState();
    const { DASHBOARD, MAIN_WALLET, AUTH, LOGIN, REGISTRATION } = AppLinksEnum;

    return(
        isAuth ? 
            <>
                <Button
                    text={'Кошельки'}
                    buttonStyle={'thin'}
                    Icon={Wallet}
                    onClick={() => goToState(`${DASHBOARD}/${MAIN_WALLET}`)}
                    mini
                />
                <Button
                    text={'Профиль'}
                    buttonStyle={'thin'}
                    Icon={User}
                    onClick={() => goToState(DASHBOARD)}
                    mini
                />
                {
                    withLogoutButton &&
                        <Button
                            text={'Выйти'}
                            buttonStyle={'thin'}
                            Icon={Logout}
                            onClick={logoutUser}
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
                    onClick={() => goToState(`${AUTH}/${LOGIN}`)}
                    mini
                />
                <Button
                    text={'Регистрация'}
                    onClick={() => goToState(`${AUTH}/${REGISTRATION}`)}
                    mini
                />
            </>
    );
};

export default HeaderUserLinks;
