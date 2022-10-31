import classNames from 'classnames';
import { useModal } from 'lib/hooks/useModal';
import { usePromiseWithLoading } from 'lib/hooks/usePromiseWithLoading';
import { WalletCategoryWithBalance } from 'lib/types/wallet';
import { Button, Input } from 'lib/ui-kit';
import { blockEAndDashKey } from 'lib/utils';
import { numberValidation } from 'lib/utils/hookFormValidation';
import StartAlgorythmModal from 'modules/terminal/modals/startAlgorythm/startAlgorythm';
import StopAlgorythmModal from 'modules/terminal/modals/stopAlgorythm/stopAlgorythm';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useWalletActions from 'services/walletActions';
import styles from './tradeView.module.scss';

interface TradeViewData {
    amount: number;
}

const TradeView = () => {

    const { promiseWithLoading } = usePromiseWithLoading();
    const { getWallets } = useWalletActions();
    const { open: openStartAlgorythmModal } = useModal(StartAlgorythmModal);
    const { open: openStopAlgorythmModal } = useModal(StopAlgorythmModal);

    const [balance, setBalance] = useState<number>(0);
    const [ isAlgorythmActive, setIsAlgorythmActive ] = useState<boolean>(false);

    useEffect(() => {
        // promiseWithLoading<WalletCategoryWithBalance>(getWallets())
        // .then(res => setBalance(res.investor));
        setBalance(100);
    }, []);

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
                if (value > balance) setError('amount', {message: 'На балансе недостаточно средств'});
                return value <= balance;
            },
        },
    });

    const setInputValueToBalance = () => {
        setValue('amount', balance, {shouldValidate: true});
        inputRef.current?.focus();
    };

    const onSubmit = (data: TradeViewData) => {
        isAlgorythmActive ? 
            openStopAlgorythmModal({
                onSubmit: setIsAlgorythmActive,
            }) : 
            openStartAlgorythmModal({
                amountToSend: data.amount,
                onSubmit: setIsAlgorythmActive,
            });

        reset();
    };
 
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles['trade-view']}
        >
            <div
                className={styles['trade-view__balance']}
            >
                <p className={classNames(
                    styles['balance-label'],
                    'caption-mini'
                )}
                >
                    Баланс
                </p>
                <p
                    className={'subtitle'}
                >
                    { balance } USDT 
                </p>
            </div>
            <Input
                label={'Объем (USDT)'}
                type={'number'}
                required
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
                            className={classNames(
                                styles['all-balance-btn'],
                                'caption'
                            )}
                            onClick={setInputValueToBalance}
                            mini
                            type={'button'}
                        />
                    }
            />
            <Button
                disabled={!isValid}
                text={isAlgorythmActive ? 'Остановить работу' : 'Начать работу'}
                buttonStyle={'outlined'}
                buttonTheme={isAlgorythmActive ? 'red' : 'green'}
                fillContainer
            />
        </form>
    );
};

export default TradeView;
