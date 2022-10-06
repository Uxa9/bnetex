import { Angle } from 'assets/images/icons';
import classNames from 'classnames';
import { useGoToState } from 'lib/hooks/useGoToState';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { useToast } from 'lib/hooks/useToast';
import { Button, Input } from 'lib/ui-kit';
import { numberValidation, requiredValidation } from 'lib/utils/hookFormValidation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AppLinksEnum } from 'routes/appLinks';
import withdrawConfirm from 'services/withdrawConfirm';
import withdrawRequest from 'services/withdrawRequset';
import styles from './withdraw.module.scss';

interface WithdrawConfirmFormData {
    requestId: number,
    confirmCode: string
}

const WithdrawConfirm = () => {

    const { bakeToast } = useToast();
    const { navigateBack, goToState } = useGoToState();
    const { isLoading, promiseWithLoading } = usePromiseWithLoading();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<WithdrawConfirmFormData>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = (data: any) => {
        promiseWithLoading(withdrawConfirm({
            ...data,
            requestId: JSON.parse(localStorage.getItem('requestId') || '{}') || ''
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
                        label={'Код подтверждения'}
                        inputControl={register('confirmCode', {...requiredValidation})}
                        errorText={errors.confirmCode?.message}
                        key={'confirmCode'} 
                    />

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

export default WithdrawConfirm;
