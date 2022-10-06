import { Angle } from 'assets/images/icons';
import classNames from 'classnames';
import { useGoToState } from 'lib/hooks/useGoToState';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { numberValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import transferBetweenWallets from 'services/transferBetweenWallets';
import withdrawConfirm from 'services/withdrawConfirm';
import withdrawRequest from 'services/withdrawRequset';
import styles from './withdraw.module.scss';

interface TransferFormData {
    userId : number,
    firstWallet : string,
    secondWallet : string,
    amount : number
}

const Transfer = () => {

    const { bakeToast } = useToast();
    const { navigateBack, goToState } = useGoToState();
    const { isLoading, promiseWithLoading } = usePromiseWithLoading();

    const [firstWallet, setFirstWallet] = useState('mainWallet');
    const [secondWallet, setSecondWallet] = useState('investWallet');

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<TransferFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = (data: any) => {
        promiseWithLoading(transferBetweenWallets({
            amount: Number(data.amount),
            firstWallet,
            secondWallet,
            userId: JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1
        }))
            .then(() => {
                goToState(AppLinksEnum.DASHBOARD);
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
                        label={'Сумма'}
                        inputControl={register('amount', {...requiredValidation})}
                        errorText={errors.amount?.message}
                        key={'amount'} 
                    />
                    <p>С</p>
                    <select
                        onChange={(e) => setFirstWallet(e.target.value)}
                    >
                        <option
                            value={"mainWallet"}
                        >
                            Основной кошелек
                        </option>
                        <option
                            value={"investWallet"}
                        >
                            Инвестиционный
                        </option>
                    </select>
                    <p>На</p>
                    <select
                        onChange={(e) => setSecondWallet(e.target.value)}
                    >
                        <option
                            value={"mainWallet"}
                        >
                            Основной кошелек
                        </option>
                        <option
                            value={"investWallet"}
                        >
                            Инвестиционный
                        </option>
                    </select>
                    <Button 
                        text={'Отправить'}
                        type={'submit'}
                        disabled={!isValid}
                    />
                </form>
            </div> 
        </div>
    );
};

export default Transfer;
