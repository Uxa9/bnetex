import { Angle } from 'assets/images/icons';
import classNames from 'classnames';
import { useGoToState } from 'lib/hooks/useGoToState';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { numberValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import useWalletActions from 'services/walletActions';
import styles from './withdraw.module.scss';

interface WithdrawFormData {
    userId: string,
    walletAddress: string,
    amount: number,
    type: string
}

const Withdraw = () => {

    const { bakeToast } = useToast();
    const { navigateBack, goToState } = useGoToState();
    const { isLoading, promiseWithLoading } = usePromiseWithLoading();
    const [balance, setBalance] = useState(0);
    const { withdrawRequest } = useWalletActions();
    
    useEffect(() => {
        setBalance(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.mainWallet || 0.00);
    }, []);
    
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<WithdrawFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = (data: any) => {
        promiseWithLoading(withdrawRequest({
            ...data,
            userId: JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId,
            type: 'withdraw',
        }))
            .then(() => {
                goToState(AppLinksEnum.WITHDRAW_CONFIRM);
            })
            .catch((error) => bakeToast.error(error.response?.data.message));
    };

    return(
        <div className='wrapper'>
            <div className='container'>
                <button 
                    className={styles['back-action']}
                    onClick={() => navigateBack(AppLinksEnum.HOME)}
                >
                    <Angle />
                    <h5>Вывод криптовалюты</h5>
                </button>
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className={classNames(styles.card, 'card')}
                >
                    <Input
                        label={'Адрес кошелька'}
                        inputControl={register('walletAddress', {...requiredValidation})}
                        errorText={errors.walletAddress?.message}
                        key={'walletAddress'} 
                    />
                    <Input
                        label={'Объем для вывода (USDT)'}
                        inputControl={register('amount', {
                            ...numberValidation,
                            max: {value: balance, message: 'На балансе недостаточно средств'},
                        })}
                        errorText={errors.amount?.message}
                        key={'walletAddress'}
                    />

                    <Button 
                        text={'Отправить'}
                        type={'submit'}
                        disabled={!isValid}
                        isLoading={isLoading}
                    />

                    <ul className={styles.disclaimer}>
                        <li className={styles.disclaimer__item}>
                            Баланс основного кошелька: <span>{balance}</span>
                        </li>
                        <li className={styles.disclaimer__item}>
                            Убедитесь, что кошелек использует сеть: <span>Tron (TRC20)</span>
                        </li>
                        <li className={styles.disclaimer__item}>
                            Комиссия сети <span>0.29 - 3.2 USDT</span>
                        </li>
                        <li className={styles.disclaimer__item}>
                            Минимальная сумма вывода: <span>10 USDT</span>
                        </li>
                    </ul>
                </form>
            </div> 
        </div>
    );
};

export default Withdraw;

