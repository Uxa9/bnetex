import { FC, useState } from 'react';

import { Button, Input, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import styles from './historyView.module.scss';
import { blockEAndDashKey } from 'lib/utils';
import clsx from 'clsx';
import { useActions } from 'lib/hooks/useActionCreators';
import { getHistoricalData } from 'store/action-creators/roepnl';
import { useAppDispatch } from 'lib/hooks/useAppDispatch';

const HistoryView = () => {

    const [period, setPeriod] = useState<number>(1);
    const [inputValue, setInputValue] = useState<number>(NaN);
    const { getTradeHistory } = useActions();
    const dispatch = useAppDispatch();

    // toDo: помойка! переделать через hook-form
    const validateInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const value = event.currentTarget.valueAsNumber;
        setInputValue(value);
    };

    const handleSubmit = () => {
        getTradeHistory(period, inputValue);
        dispatch(getHistoricalData(period, inputValue));
    };

    return (
        <>
            <Input
                label={'Объем инвестиций (USDT)'}
                type={'number'}
                required
                value={inputValue}
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
                    onChange={setPeriod}
                    value={period}
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
                    disabled={!inputValue}
                    text={'Рассчитать доход'}
                    fillContainer
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
};

export default HistoryView;
