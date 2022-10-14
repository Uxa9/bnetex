import { useTypedSelector } from 'lib/hooks/useTypedSelector';
import { Button, Input } from 'lib/ui-kit';
import { blockEAndDashKey } from 'lib/utils';
import { createRef, useEffect, useState } from 'react';
import getWallets from 'services/getWallets';
import { setInvestWallet, setMainWallet } from 'store/action-creators/user';
import styles from '../investorView.module.scss';

const TradeView = () => {

    const [inputValue, setInputValue] = useState<number | ''>('');
    const { investWallet } = useTypedSelector(state => state.user);
    // Костыльное решение, лучше бы сделать через react-hook-form
    const [inputError, setInputError] = useState<string>('');

    useEffect(() => {
        getWallets(JSON.parse(localStorage.getItem('userInfo-BNETEX') || '{}')?.userId || 1)
            .then(async (wallets) => {
                await setMainWallet(wallets.mainWallet);
                await setInvestWallet(wallets.investWallet);                
            });

    }, []);

    const validateInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const value = event.currentTarget.valueAsNumber;

        setInputError(value > investWallet ? 'На балансе недостаточно средств' : '');

        setInputValue(isNaN(value) ? '' : value);
    };

    const inputRef = createRef<HTMLInputElement>();

    const setInputValueToBalance = () => {
        setInputValue(investWallet);
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
                    {investWallet} USDT 
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
                    buttonStyle={'stroke'}
                    disabled={!(!(inputValue.toString() === '') && !inputError)}
                    text={'Начать работу'}
                />
            </div>
        </>
    );
};

export default TradeView;
