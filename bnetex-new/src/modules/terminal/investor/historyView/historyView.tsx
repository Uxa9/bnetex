import { useState } from 'react';

import { Button, Input, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';

import styles from '../investorView.module.scss';
import { blockEAndDashKey } from 'lib/utils';

const HistoryView = () => {

    const [period, setPeriod] = useState('1');

    const [inputValue, setInputValue] = useState<number | ''>('');

    const validateInputChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        const value = event.currentTarget.valueAsNumber;

        setInputValue(isNaN(value) ? '' : value);
    };

    return (
        <>
            <div
                className={styles['investor-invest']}
            >
                <Input
                    label={'Объем инвестиций (USDT)'}
                    type={'number'}
                    required
                    value={inputValue}
                    onChange={validateInputChange}
                    onKeyPress={blockEAndDashKey}
                />
            </div>
            <div
                className={styles['investor-prediction-period']}
            >
                <p
                    className={styles['header']}
                >
                    Выберите срок инвестиций
                </p>
                <ToggleButtonGroup 
                    title={''} 
                    name={''} 
                    onChange={(value) => {
                        setPeriod(value);
                    }}
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
            <div
                className={styles['button-wrapper']}
            >
                <Button
                    buttonStyle={'stroke'}
                    disabled={!inputValue}
                    text={'Рассчитать доход'}
                />
            </div>
        </>
    );
};

export default HistoryView;
