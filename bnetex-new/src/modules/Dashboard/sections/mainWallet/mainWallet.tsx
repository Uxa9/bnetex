import styles from './mainWallet.module.scss';
import clsx from 'clsx';
import { Button } from 'lib/ui-kit';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import { useModal } from 'lib/hooks/useModal';
import TransferModal from 'modules/Payments/Transfer/transferModal';
import { useEffect } from 'react';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { getWallets } from 'store/action-creators/wallet';
import Skeleton from 'lib/ui-kit/skeleton/skeleton';

// toDo
// сделать нормальные кнопки

const MainWallet = () => {

    const { goToState } = useGoToState();
    const dispath = useAppDispatch();
    const { mainWallet, loading: walletsLoading } = useTypedSelector(state => state.wallet);

    useEffect(() => {
        dispath(getWallets());
    }, []);

    const { open: OpenTransferModal } = useModal(TransferModal);

    return(
        <div className={styles.wallet}>
            <div className={styles['wallet-header']}>
                <h3>Основной кошелек</h3>
                <div className={styles['btns']}>
                    <Button
                        text={'Ввод'}
                        onClick={() => goToState(AppLinksEnum.DEPOSIT)}
                    />
                    <Button
                        buttonStyle={'outlined'}
                        text={'Вывод'}
                        onClick={() => goToState(AppLinksEnum.WITHDRAW)}
                    />
                    <Button
                        text='Перевод'
                        buttonStyle={'flat'}
                        onClick={() => OpenTransferModal({})}
                    />
                </div>
            </div>
            <div className={clsx(styles['wallet-card'], 'card')}>
                <div className={styles['balance-item']}>
                    <p
                        className={clsx(
                            styles['balance-item__label'],
                            'caption',
                        )}
                    >
                        Баланс
                    </p>
                    <h6 className={styles['balance-item__value']}>
                        {
                            walletsLoading ?
                                <Skeleton
                                    height={'24px'}
                                    width={'40%'}
                                /> :
                                mainWallet
                        }
                    </h6>
                </div>
            </div>
        </div>
    );
};

export default MainWallet;
