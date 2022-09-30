import styles from './deposit.module.scss';
import { Angle } from 'assets/images/icons';
import { Button, Input } from 'lib/ui-kit';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { numberValidation } from 'lib/utils/hookFormValidation';
import { blockEAndDashKey } from 'lib/utils';
import { useGoToState } from 'lib/hooks/useGoToState';
import { AppLinksEnum } from 'routes/appLinks';
import React, { useMemo, useState } from 'react';
import CopyButton from 'lib/ui-kit/copyButton/copyButton';
import { useToast } from 'lib/hooks/useToast';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { createTransaction } from 'services/transactions';

const Deposit = () => {

    const {navigateBack} = useGoToState();
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [selectedAmount, setSelectedAmount] = useState<number>(0);

    const { bakeToast } = useToast();
    const {promiseWithLoading, isLoading} = usePromiseWithLoading();
    
    const AMOUNT_WITH_FEE = 0.995;
    const MAX_TRANSACTION_VALUE = 10000;

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
        },
    } = useForm<{amount: number}>({
        mode: 'onChange',
        criteriaMode: 'all',
        reValidateMode: 'onChange',
    });

    const onSubmit = async (data: {amount: number}) => {
        
        promiseWithLoading(createTransaction(data.amount))
            .then((response) => {
                setWalletAddress(response.data.transaction.payAddress);
            })
            .catch((error) => bakeToast.error(error.response?.data.message));

        // В фукнкции запроса используй protectedApi из useApi, чтобы достать токен

        // promiseWithLoading(async функция с запросом)
        //     .then((какой то адрес) => setWalletAddress(какой то адрес))
        //     .catch((error) => bakeToast.error(error.response?.data.message));
        // console.log(data);
        // setWalletAddress('TBJGtXn5TkNazxiRrf3hpao3eSY3uMRneG');
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAmount(event.currentTarget.valueAsNumber);
    };

    const valueWithFee: number = useMemo(() =>{
        return isNaN(selectedAmount) ? 
            0
            : selectedAmount > MAX_TRANSACTION_VALUE ? 
                MAX_TRANSACTION_VALUE 
                : selectedAmount * AMOUNT_WITH_FEE;
    }, [selectedAmount]);


    return(
        <div className='wrapper'>
            <div className='container'>
                <button 
                    className={styles['back-action']}
                    onClick={() => navigateBack(AppLinksEnum.HOME)}
                >
                    <Angle />
                    <h5>Ввод криптовалюты</h5>
                </button>

                <form 
                    className={classNames('card', styles.form)}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input 
                        label={'Сумма (USDT)'}
                        type={'number'}
                        step={'0.01'}
                        errorText={errors.amount?.message}
                        inputControl={
                            register(
                                'amount', 
                                {...numberValidation,
                                    max: {value: 10000, message: 'Не более 10000'},
                                    onChange: onInputChange}
                            )}
                        onKeyPress={blockEAndDashKey}
                        disabled={!!walletAddress} //Костыль, надо нормальный flow делать с предложением получить новый кошелек
                    />
                    {
                        !walletAddress &&
                        <Button 
                            text={'Получить кошелек'}
                            buttonStyle={'primary'}
                            disabled={!isValid}
                            type={'submit'}
                            isLoading={isLoading}
                        />
                    }
                    {
                        walletAddress &&
                        <div className={styles.address}>
                            <span className='label-1'>Адрес</span>
                            <div className={styles['address__wrapper']}>
                                <p className={styles['address__code']}>{walletAddress}</p>
                                <CopyButton 
                                    textToCopy={walletAddress}
                                    successText={'Адрес кошелька успешно скопирован!'}
                                />
                            </div>
                        </div>
                    }

                    <ul className={styles.disclaimer}>
                        {
                            selectedAmount !== 0 &&
                            <li className={styles.disclaimer__item}>
                            C учетом комиссии <span>0.05%</span>, на ваш кошелек будет зачислено 
                                <span> {valueWithFee} USDT</span>
                            </li>
                        }
                        {
                            walletAddress &&
                            <>
                                <li className={styles.disclaimer__item}>
                            Отправляйте на этот адрес только <span>USDT</span>
                                </li>
                                <li className={styles.disclaimer__item}>
                            Отправляйте средства через сеть: <span>Tron (TRC20)</span>
                                </li>
                                <li className={styles.disclaimer__item}>
                            Средства будут зачислены на ваш основной кошелек
                                </li>
                                <li className={styles.disclaimer__item}>
                            Минимальная сумма ввода: 0.01 USDT
                                </li>
                            </>
                        }
                      
                     
                    </ul>
                </form>
            </div> 
        </div>
    );
};

export default Deposit;

