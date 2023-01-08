import clsx from 'clsx';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { useModal } from 'lib/hooks/useModal';
import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button, Input } from 'lib/ui-kit';
import { blockEAndDashKey } from 'lib/utils';
import { numberValidation } from 'lib/utils/hookFormValidation';
import StartAlgorythmModal from 'modules/terminal/modals/startAlgorythm/startAlgorythm';
import StopAlgorythmModal from 'modules/terminal/modals/stopAlgorythm/stopAlgorythm';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { startInvestTrading, stopInvestTrading } from 'services/investTrading';
import { getUser } from 'services/user';
import { getWallets } from 'store/action-creators/wallet';
import styles from './tradeView.module.scss';

interface TradeViewData {
    amount: number;
}

const TradeView = () => {

    const { open: openStartAlgorythmModal } = useModal(StartAlgorythmModal);
    const { open: openStopAlgorythmModal } = useModal(StopAlgorythmModal);
    const dispath = useAppDispatch();

    const useWallet = useTypedSelector(state => state.wallet);

    const [operationalBalance, setOperationalBalance] = useState<number>(0);
    const [ isAlgorythmActive, setIsAlgorythmActive ] = useState<boolean>(false);
    
    const [investWallet, setInvestWallet] = useState<number>(useWallet.investWallet);

    useEffect(() => {
        getUser()
            .then(res => {
                setIsAlgorythmActive(res.data.openTrade);

                if (res.data.openTrade) {
                    setOperationalBalance(res.data.tradeBalance);
                }
            });
    }, []);

    useEffect(() => { 
        dispath(getWallets()).catch(() => {});        
    }, [ isAlgorythmActive ]);

    useEffect(() => {
        setInvestWallet(useWallet.investWallet);
    }, [useWallet])

    const startInvestAlgorythm = async (amount: number) => {
        await startInvestTrading(amount);
        setIsAlgorythmActive(true);
        setOperationalBalance(amount);
    };

    const stopInvestAlgorythm = async () => {
        await stopInvestTrading();
        setIsAlgorythmActive(false);
        setOperationalBalance(0);
    };

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: {
            errors,
            isValid,
        },
    } = useForm<TradeViewData>({
        mode: 'onChange',
        criteriaMode: 'firstError',
        reValidateMode: 'onChange',
    });

    const inputRef = useRef<HTMLInputElement | null>(null);

    const { ref: hookInputRef, ...rest } = register('amount', {
        ...numberValidation,
        min: {
            value: 0.00001,
            message: 'Минимальное значение - 0.00001 USDT',
        },
        validate: {
            isNotGreaterThanBalance: value => {
                if (value > investWallet) setError('amount', {message: 'На балансе недостаточно средств'});
                return value <= investWallet;
            },
        },
    });

    const setInputValueToBalance = () => {
        setValue('amount', investWallet, {shouldValidate: true});
        inputRef.current?.focus();
    };

    const onSubmit = (data: TradeViewData) => {
        openStartAlgorythmModal({
            amountToSend: data.amount,
            onSubmit: startInvestAlgorythm,
        });
        reset();
    };

    const onStop = () => {
        openStopAlgorythmModal({
            onSubmit: stopInvestAlgorythm,
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles['trade-view']}
        >
            <div
                className={styles['trade-view__balance']}
            >
                <div className={styles['balance-item']}>
                    <p className={clsx(
                        styles['balance-label'],
                        'caption-mini'
                    )}
                    >
                    Баланс
                    </p>
                    <p
                        className={'subtitle'}
                    >
                        { investWallet } USDT
                    </p>
                </div>
                {
                    operationalBalance !== 0 &&
                    <div  className={styles['balance-item']}>
                        <p className={clsx(
                            styles['balance-label'],
                            'caption-mini'
                        )}
                        >
                        В работе
                        </p>
                        <p
                            className={'subtitle'}
                        >
                            { operationalBalance } USDT
                        </p>
                    </div>
                }
            </div>
            {
                !isAlgorythmActive &&
                <Input
                    label={'Объем (USDT)'}
                    type={'number'}
                    errorText={errors.amount?.message}
                    onKeyPress={blockEAndDashKey}
                    {...rest}
                    ref={e => {
                        hookInputRef(e);
                        inputRef.current = e;
                    }}
                    postfix=
                        {
                            <Button
                                text={'Весь баланс'}
                                buttonStyle={'flat'}
                                className={clsx(
                                    styles['all-balance-btn'],
                                    'caption'
                                )}
                                onClick={setInputValueToBalance}
                                mini
                                type={'button'}
                            />
                        }
                />
            }
            {
                isAlgorythmActive ?
                    <Button
                        disabled={!isValid && !isAlgorythmActive}
                        text={'Остановить работу'}
                        buttonStyle={'outlined'}
                        buttonTheme={'red'}
                        type={'button'}
                        onClick={onStop}
                        fillContainer
                    />
                    :
                    <Button
                        disabled={!isValid}
                        text={'Начать работу'}
                        buttonStyle={'outlined'}
                        buttonTheme={'green'}
                        fillContainer
                    />
            }
        </form>
    );
};

export default TradeView;
