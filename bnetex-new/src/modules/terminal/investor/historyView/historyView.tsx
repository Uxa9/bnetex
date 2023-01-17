import { useState } from 'react';
import { Button, Input, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import styles from './historyView.module.scss';
import { blockEAndDashKey } from 'lib/utils';
import clsx from 'clsx';
import { useActions } from 'lib/hooks/useActionCreators';
import { getHistoricalData } from 'store/action-creators/roepnl';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';
import { HistoryPeriod } from 'modules/TradingView/api/types';
import { triggerTVMarkRefresh } from 'store/action-creators/algotrade';

// toDo: тут говно на говне, костыль на костыле)

const HistoryView = () => {

    const [historyPeriod, setHistoryPeriod] = useState<HistoryPeriod>(6);
    const [inputValue, setInputValue] = useState<number>(NaN);
    const { getTradeHistory } = useActions();
    const dispatch = useAppDispatch();

    // toDo: помойка! переделать через hook-form
    const validateInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const value = event.currentTarget.valueAsNumber;
        setInputValue(value);
    };

    const handleSubmit = () => {
        if (!historyPeriod) return;

        getTradeHistory(historyPeriod, inputValue);
        dispatch(getHistoricalData(historyPeriod, inputValue));
        localStorage.setItem('history', historyPeriod ? String(historyPeriod) : '');
        dispatch(triggerTVMarkRefresh());
    };

    return (
        <>
            <Input
                label={'Объем инвестиций (USDT)'}
                type={'number'}
                required
                value={isNaN(inputValue) ? '' : inputValue}
                onChange={validateInputChange}
                onKeyPress={blockEAndDashKey}
            />
            <div
                className={styles['prediction-period']}
            >
                <p
                    className={clsx(
                        styles['prediction-period__label'],
                        'caption-mini'
                    )}
                >
                    Выберите срок инвестиций
                </p>
                <ToggleButtonGroup
                    title={''}
                    name={'historyPeriod'}
                    onChange={setHistoryPeriod}
                    value={historyPeriod}
                    asNumber
                    exclusive
                >
                    <ToggleButton
                        text={'1 мес.'}
                        value={1}
                    />
                    <ToggleButton
                        text={'3 мес.'}
                        value={3}
                    />
                    <ToggleButton
                        text={'6 мес.'}
                        value={6}
                    />
                </ToggleButtonGroup>
            </div>
            <div
                className={styles['button-wrapper']}
            >
                <Button
                    buttonStyle={'outlined'}
                    disabled={!inputValue || !historyPeriod}
                    text={'Рассчитать доход'}
                    fillContainer
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
};

export default HistoryView;
