import { useState } from 'react';
import { Button, Input, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';
import styles from './historyView.module.scss';
import { blockEAndDashKey } from 'lib/utils';
import classNames from 'classnames';

const HistoryView = () => {

    const [period, setPeriod] = useState('1');
    const [inputValue, setInputValue] = useState<number | ''>('');

    const validateInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const value = event.currentTarget.valueAsNumber;

        setInputValue(isNaN(value) ? '' : value);
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
                    className={classNames(
                        styles['prediction-period__label'],
                        'caption-mini'
                    )}
                >
                    Выберите срок инвестиций
                </p>
                <ToggleButtonGroup 
                    title={''} 
                    name={''} 
                    onChange={setPeriod}
                    value={period}
                >
                    <ToggleButton 
                        text={'1 мес.'} 
                        value={'1'} 
                    />
                    <ToggleButton 
                        text={'3 мес.'} 
                        value={'3'} 
                    />
                    <ToggleButton 
                        text={'6 мес.'} 
                        value={'6'} 
                    />
                    <ToggleButton 
                        text={'9 мес.'} 
                        value={'9'} 
                    />
                    <ToggleButton 
                        text={'12 мес.'} 
                        value={'12'} 
                    />
                </ToggleButtonGroup>
            </div>
            <Button
                buttonStyle={'outlined'}
                disabled={!inputValue}
                text={'Рассчитать доход'}
                fillContainer
            />
        </>
    );
};

export default HistoryView;
