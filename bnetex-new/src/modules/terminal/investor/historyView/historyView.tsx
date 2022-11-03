import { FC, useState } from 'react';

import { Button, Input, ToggleButton, ToggleButtonGroup } from 'lib/ui-kit';

import styles from '../investorView.module.scss';
import { blockEAndDashKey } from 'lib/utils';

interface HistoryViewProps {
    handleClick(period: number, amount: number): void
}

const HistoryView: FC<HistoryViewProps> = props => {

    const [period, setPeriod] = useState(1);

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
                    Выберите срок инвестиций среди вариантов ниже
                </p>
                <ToggleButtonGroup 
                    title={''} 
                    name={''} 
                    onChange={setPeriod}
                    value={period}
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
                    <ToggleButton 
                        text={'9 мес.'} 
                        value={9} 
                    />
                    <ToggleButton 
                        text={'12 мес.'} 
                        value={12} 
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
                    onClick={() => {props.handleClick(Number(period), Number(inputValue))}}
                />
            </div>
        </>
    );
};

export default HistoryView;
