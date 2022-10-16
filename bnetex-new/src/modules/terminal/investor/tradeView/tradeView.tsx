import { Button, Input } from 'lib/ui-kit';
import { blockEAndDashKey } from 'lib/utils';
import { createRef, useState } from 'react';
import styles from '../investorView.module.scss';

const TradeView = () => {

    const [inputValue, setInputValue] = useState<number | ''>('');

    // Костыльное решение, лучше бы сделать через react-hook-form
    const [inputError, setInputError] = useState<string>('');

    // Это должно приходить с бэка
    const balance = 21567.34;

    const validateInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const value = event.currentTarget.valueAsNumber;

        setInputError(value > balance ? 'На балансе недостаточно средств' : '');

        setInputValue(isNaN(value) ? '' : value);
    };

    const inputRef = createRef<HTMLInputElement>();

    const setInputValueToBalance = () => {
        setInputValue(balance);
        inputRef.current?.focus();
    };
 
    return (
        <>
            <div
                className={styles['investor-balance']}
            >
                <p
                    className={styles['header']}
                >
                    Баланс
                </p>
                <p
                    className={styles['investor-balance-amount']}
                >
                    {balance} USDT 
                </p>
            </div>
            <div
                className={styles['investor-invest']}
            >
                <Input
                    label={'Объем инвестиций (USDT)'}
                    type={'number'}
                    required
                    value={inputValue}
                    onChange={validateInputChange}
                    errorText={inputError}
                    onKeyPress={blockEAndDashKey}
                    ref={inputRef}
                    postfix=
                        {
                            <Button 
                                text={'Весь баланс'}
                                buttonStyle={'thin'}
                                className={styles['all-balance-btn']}
                                onClick={setInputValueToBalance}
                            />
                        }
                />
            </div>
            <div
                className={styles['button-wrapper']}
            >
                <Button
                    disabled={!inputValue || !inputError}
                    text={'Начать работу'}
                    buttonTheme={'green'}
                />
            </div>
        </>
    );
};

export default TradeView;
