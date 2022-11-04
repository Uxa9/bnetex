import { CircledCheck } from 'assets/images/icons';
import classNames from 'classnames';
import { useGoToState } from 'lib/hooks/useGoToState';
import { Button } from 'lib/ui-kit';
import { useEffect } from 'react';
import { AppLinksEnum } from 'routes/appLinks';
import styles from './registrationFinalize.module.scss';

const RegistrationFinalize = () => {
    const { goToState } = useGoToState();
    const { HOME, DASHBOARD, MAIN_WALLET }  = AppLinksEnum;

    useEffect(() => {
        const isJustRegistered = localStorage.getItem('justRegistered');
        isJustRegistered ? localStorage.removeItem('justRegistered') : goToState(HOME);
    }, []);

    return(
        <div 
            className={classNames(
                styles['card'],
                'card',
            )}
        >
            <div className={styles['text-icon']}>
                <CircledCheck />
                <h2>Аккаут создан!</h2>
            </div>
            <p className={'text'}>
                Спасибо, что выбрали BNETEX! Теперь вы можете перейти к пополнению кошелька и
             торговле на бирже в нашем революционном терминале.
            </p>
            <Button 
                text={'Перейти в кошелек'}
                onClick={() => goToState(`${DASHBOARD}`)}
            />
        </div>
    );
};

export default RegistrationFinalize;
